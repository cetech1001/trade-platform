import { Injectable, Logger } from '@nestjs/common';
import {
  CreateDeposit,
  Deposit,
  DepositStatus,
  FindDepositsQueryParams,
  Transaction,
  TransactionType,
  UpdateDeposit,
  User,
  UserRole
} from '@coinvant/types';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { DepositEntity } from './entities/deposit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionService } from '../transaction/transaction.service';
import { PaymentMethodService } from '../payment-method/payment-method.service';
import { AccountService } from '../account/account.service';
import { EmailService } from '../email/email.service';
import { formatCurrency } from '../../helpers';
import { environment } from '../../environments/environment';
import { DBTransactionService } from '../common/db-transaction.service';
import { DecimalHelper } from '../../helpers/decimal';

@Injectable()
export class DepositService {
  private readonly logger = new Logger(DepositService.name);

  constructor(
    @InjectRepository(DepositEntity) private readonly depositRepo:
    Repository<DepositEntity>,
    private readonly dbTransactionService: DBTransactionService,
    private readonly accountService: AccountService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly transactionService: TransactionService,
    private readonly emailService: EmailService) {}

  async create(file: Express.Multer.File, createDeposit: CreateDeposit, user: User): Promise<Transaction> {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      const account = await this.accountService.findOne(createDeposit.accountID);
      const paymentMethod = await this.paymentMethodService.findOne(createDeposit.paymentMethod);

      // Validate and normalize deposit amount
      const depositAmount = DecimalHelper.normalize(createDeposit.amount);

      if (DecimalHelper.isLessThan(depositAmount, 0) || DecimalHelper.isEqual(depositAmount, 0)) {
        throw new Error('Invalid deposit amount');
      }

      const deposit = await queryRunner.manager.save(DepositEntity, {
        ...createDeposit,
        amount: depositAmount,
        paymentMethod: `${paymentMethod.name} - ${paymentMethod.network}`,
        account,
        proof: file.filename,
      });

      const transaction = await this.transactionService.create({
        amount: depositAmount,
        type: TransactionType.deposit,
        status: deposit.status,
        transactionID: deposit.id,
        account,
      }, queryRunner);

      Promise.all([
        this.emailService.sendMail(user.email, 'Deposit Request Received', './user/new-deposit', {
          name: user.name,
          amount: formatCurrency(depositAmount),
        }),
        this.emailService.sendMail(environment.supportEmail, 'New Deposit Alert', './admin/new-deposit', {
          name: user.name,
          amount: formatCurrency(depositAmount),
          method: `${paymentMethod.name} (${paymentMethod.network})`,
        }),
      ]).catch(error => {
        this.logger.error("Failed to send emails: ", error);
      });

      return transaction;
    });
  }

  findAll(query: FindDepositsQueryParams, user: User): Promise<Pagination<Deposit>> {
    let { accountID } = query;
    const queryBuilder = this.depositRepo.createQueryBuilder('D')
      .leftJoinAndSelect('D.account', 'A');

    if (user.role === UserRole.admin) {
      queryBuilder
        .leftJoinAndSelect('A.user', 'U');
    } else {
      if (!accountID) {
        accountID = user.accounts[0].id;
      }
      queryBuilder.where('A.id = :accountID', { accountID });
    }

    queryBuilder.orderBy('D.createdAt', 'DESC');

    return paginate(queryBuilder, query);
  }

  async fetchTotalDepositAmount(): Promise<number> {
    const data = await this.depositRepo.createQueryBuilder('D')
      .select('SUM(D.amount)', 'total')
      .where('D.status = :status', { status: DepositStatus.confirmed })
      .getRawOne();
    return DecimalHelper.normalize(data?.total || 0);
  }

  findOne(id: string): Promise<Deposit> {
    return this.depositRepo.findOne({ where: { id }, relations: ['account', 'account.user'] });
  }

  async update(id: string, updateDeposit: UpdateDeposit): Promise<Deposit> {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      await queryRunner.manager.update(DepositEntity, id, updateDeposit);

      const deposit = await this.findOne(id);
      const {user} = deposit.account;
      const depositAmount = DecimalHelper.normalize(deposit.amount);

      if (updateDeposit.status === DepositStatus.confirmed) {
        await this.accountService.increaseBalance(deposit.account.id, depositAmount, queryRunner);

        this.emailService.sendMail(user.email, 'Deposit Confirmed', './user/deposit-confirmed', {
          name: user.name,
          amount: formatCurrency(depositAmount),
        }).catch(error => {
          this.logger.error("Failed to send email: ", error);
        });
      }

      if (updateDeposit.status === DepositStatus.rejected) {
        this.emailService.sendMail(user.email, 'Deposit Rejected', './user/deposit-rejected', {
          name: user.name,
          amount: formatCurrency(depositAmount),
        }).catch(error => {
          this.logger.error("Failed to send email: ", error);
        });
      }

      await this.transactionService.update(id, updateDeposit, queryRunner);

      return deposit;
    });
  }

  async remove(id: string) {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      await this.transactionService.remove(id, queryRunner);
      await queryRunner.manager.delete(DepositEntity, id);
    });
  }
}
