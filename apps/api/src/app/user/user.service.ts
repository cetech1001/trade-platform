import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKYC, CreateUser, KYCStatus, PaginationOptions, UpdateUser, User, UserRole } from '@coinvant/types';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AccountService } from '../account/account.service';
import { KycEntity } from './entities/kyc.entity';
import { EmailService } from '../email/email.service';
import { formatDate } from '../../helpers';
import { environment } from '../../environments/environment';
import { DBTransactionService } from '../common/db-transaction.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly dbTransactionService: DBTransactionService,
    private readonly accountService: AccountService,
    private readonly emailService: EmailService,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(KycEntity) private readonly kycRepo: Repository<KycEntity>) {
  }

  async create(createUserDto: CreateUser): Promise<User> {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      const userExists = await this.findOne({email: createUserDto.email});
      if (userExists) {
        throw new BadRequestException("Email address already exists");
      }
      const user = await queryRunner.manager.save(UserEntity, createUserDto);
      await this.accountService.create({
        user,
        walletBalance: 100000
      }, queryRunner);
      Promise.all([
        /*this.emailService.sendMail(user.email, `Welcome to ${environment.appName}`, './user/welcome', {
          name: user.name,
        }),*/
        this.emailService.sendMail(environment.supportEmail, 'New User Registration', './admin/new-user-registration', {
          name: user.name,
          email: user.email,
          registrationDate: formatDate(user.createdAt),
        }),
      ]).catch(error => {
        this.logger.error("Failed to send email:", error);
      });
      return user;
    });
  }

  async findAll(options: PaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepo.createQueryBuilder('U')
      .addSelect('U.password')
      .where('U.role = :role', { role: UserRole.user });
    return paginate<User>(queryBuilder, options);
  }

  findOne(condition: { id?: string; email?: string; password?: string; role?: UserRole }): Promise<User> {
    if (condition.password && !condition.email) {
      throw new BadRequestException("Unauthorized action");
    }
    return this.userRepo.findOne({ where: condition, relations: ['accounts'] });
  }

  findByAccountID(accountID: string): Promise<User> {
    return this.userRepo.findOne({ where: { accounts: { id: accountID } } });
  }

  async update(id: string, updateUser: UpdateUser, queryRunner?: QueryRunner): Promise<User> {
    if (updateUser.email) {
      const emailExists = await this.findOne({email: updateUser.email});
      if (emailExists && emailExists.id !== id) {
        throw new BadRequestException("Email address already exists");
      }
    }
    if (queryRunner) {
      await queryRunner.manager.update(UserEntity, id, updateUser);
    } else {
      await this.userRepo.update(id, updateUser);
    }
    const user = await this.findOne({id});
    /*if (updateUser.kycStatus) {
      if (updateUser.kycStatus === KYCStatus.verified) {
        this.emailService.sendMail(user.email, 'KYC Approved', './user/kyc-approved', {
          name: user.name,
        }).catch(error => {
          this.logger.error("Failed to send email:", error);
        });
      } else if (updateUser.kycStatus === KYCStatus.notStarted) {
        this.emailService.sendMail(user.email, 'KYC Rejected', './user/kyc-rejected', {
          name: user.name,
        }).catch(error => {
          this.logger.error("Failed to send email:", error);
        });
      }
    }*/
    if (queryRunner) {
      return {
        ...user,
        ...updateUser,
      };
    }
    return user;
  }

  async uploadKYC(files: Express.Multer.File[], createKYC: CreateKYC, user: User) {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      const photo = files.find(f => f.fieldname === 'photo');
      const idCard = files.find(f => f.fieldname === 'idCard');
      const proofOfAddress = files.find(f => f.fieldname === 'proofOfAddress');
      const kyc = await queryRunner.manager.save(KycEntity, {
        ...createKYC,
        photo: photo.filename,
        idCard: idCard.filename,
        proofOfAddress: proofOfAddress.filename,
        user,
      });
      const updatedUser = await this.update(user.id, { kycStatus: KYCStatus.pending }, queryRunner);
      Promise.all([
        /*this.emailService.sendMail(user.email, 'KYC Verification Submitted', './user/new-kyc-verification', {
          name: user.name,
        }),*/
        this.emailService.sendMail(environment.supportEmail, 'New KYC Verification Submitted', './admin/new-kyc-verification', {
          name: user.name,
          email: user.email,
          submissionDate: formatDate(kyc.createdAt),
        }),
      ]).catch(error => {
        this.logger.error("Failed to send email:", error);
      });
      return updatedUser;
    });
  }

  async findKYC(options: PaginationOptions){
    return paginate(this.kycRepo, options);
  }

  async removeKYC(id: string) {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      const kyc = await this.kycRepo.findOneBy({ id });
      if (kyc) {
        await queryRunner.manager.delete(KycEntity, id);
        return this.update(kyc.user.id, { kycStatus: KYCStatus.notStarted }, queryRunner);
      }
    });
  }

  remove(id: string) {
    return this.userRepo.delete(id);
  }
}
