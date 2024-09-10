import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKYC, CreateUser, KYCStatus, PaginationOptions, UpdateUser, User, UserRole } from '@coinvant/types';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { AccountService } from '../account/account.service';
import { KycEntity } from './entities/kyc.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountService: AccountService,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(KycEntity) private readonly kycRepo: Repository<KycEntity>) {
  }

  async create(createUserDto: CreateUser): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const userExists = await this.findOne({email: createUserDto.email});
      if (userExists) {
        throw new BadRequestException("Email address already exists");
      }
      const user = await queryRunner.manager.save(UserEntity, createUserDto);
      await this.accountService.create({ userID: user.id }, queryRunner);
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(options: PaginationOptions): Promise<Pagination<User>> {
    return paginate(this.userRepo, options, { where: { role: UserRole.user } });
  }

  findOne(condition: { id?: string; email?: string; }): Promise<User> {
    return this.userRepo.findOne({ where: condition, relations: ['accounts'] });
  }

  async update(id: string, updateUser: UpdateUser, queryRunner?: QueryRunner): Promise<User> {
    if (updateUser.email) {
      const user = await this.findOne({email: updateUser.email});
      if (user && user.id !== id) {
        throw new BadRequestException("Email address already exists");
      }
    }
    if (queryRunner) {
      await queryRunner.manager.update(UserEntity, id, updateUser);
    } else {
      await this.userRepo.update(id, updateUser);
    }
    return this.findOne({id});
  }

  async uploadKYC(files: Express.Multer.File[], createKYC: CreateKYC, user: User) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const photo = files.find(f => f.fieldname === 'photo');
      const idCard = files.find(f => f.fieldname === 'idCard');
      const proofOfAddress = files.find(f => f.fieldname === 'proofOfAddress');
      await queryRunner.manager.save(KycEntity, {
        ...createKYC,
        photo: photo.filename,
        idCard: idCard.filename,
        proofOfAddress: proofOfAddress.filename,
        user,
      });
      return await this.update(user.id, { kycStatus: KYCStatus.pending }, queryRunner);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findKYC(options: PaginationOptions){
    return paginate(this.kycRepo, options);
  }

  async removeKYC(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const kyc = await this.kycRepo.findOneBy({ id });
      if (kyc) {
        await queryRunner.manager.delete(KycEntity, id);
        return await this.update(kyc.user.id, { kycStatus: KYCStatus.notStarted }, queryRunner);
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: string) {
    return this.userRepo.delete(id);
  }
}
