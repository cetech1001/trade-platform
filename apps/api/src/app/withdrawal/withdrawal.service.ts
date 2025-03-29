import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WithdrawalEntity } from './entities/withdrawal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateWithdrawal, FindWithdrawalsQueryParams,
  Transaction,
  TransactionType,
  UpdateWithdrawal,
  User,
  UserRole,
  Withdrawal,
  WithdrawalStatus
} from '@coinvant/types';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { TransactionService } from '../transaction/transaction.service';
import { AccountService } from '../account/account.service';
import { EmailService } from '../email/email.service';
import { formatCurrency } from '../../helpers';
import { environment } from '../../environments/environment';
import { PaymentMethodService } from '../payment-method/payment-method.service';
import { DBTransactionService } from '../common/db-transaction.service';

@Injectable()
export class WithdrawalService {
  private readonly logger = new Logger(WithdrawalService.name);

  constructor(
      @InjectRepository(WithdrawalEntity) private readonly withdrawalRepo:
          Repository<WithdrawalEntity>,
      private readonly dbTransactionService: DBTransactionService,
      private readonly accountService: AccountService,
      private readonly paymentMethodService: PaymentMethodService,
      private readonly transactionService: TransactionService,
      private readonly emailService: EmailService) {}

  async create(createWithdrawal: CreateWithdrawal, user: User): Promise<Transaction> {
    console.log("Came in here");
    console.log(createWithdrawal);
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      const account = await this.accountService.findOne(createWithdrawal.accountID);
      const withdrawal = await queryRunner.manager.save(WithdrawalEntity, {
        ...createWithdrawal,
        account,
      });

      const transaction = await this.transactionService.create({
        amount: withdrawal.amount,
        type: TransactionType.withdrawal,
        status: withdrawal.status,
        transactionID: withdrawal.id,
        account,
      }, queryRunner);

      console.log("Transaction", transaction);

      Promise.all([
        this.emailService.sendMail(user.email, 'Withdrawal Request Received', './user/new-withdrawal', {
          name: user.name,
          amount: formatCurrency(withdrawal.amount),
        }),
        this.emailService.sendMail(environment.supportEmail, 'New Withdrawal Alert', './admin/new-withdrawal', {
          name: user.name,
          amount: formatCurrency(withdrawal.amount),
          method: createWithdrawal.paymentMethod,
        }),
      ]).catch(error => {
        console.log("Came to error");
        this.logger.error("Failed to send email:", error);
      });

      return transaction;
    });
  }

  findAll(query: FindWithdrawalsQueryParams, user: User): Promise<Pagination<Withdrawal>> {
    let { accountID } = query;
    const queryBuilder = this.withdrawalRepo.createQueryBuilder('W');

    if (user.role === UserRole.admin) {
      queryBuilder
        .leftJoinAndSelect('W.account', 'A')
        .leftJoinAndSelect('A.user', 'U');
    }

    if (user.role === UserRole.user) {
      if (!accountID) {
        accountID = user.accounts[0].id;
      }
      queryBuilder.where('A.id = :accountID', { accountID });
    }

    queryBuilder.orderBy('W.createdAt', 'DESC');

    return paginate(queryBuilder, query);
  }

  async fetchTotalWithdrawalAmount() {
    const data = await this.withdrawalRepo.createQueryBuilder('W')
      .select('SUM(W.amount)', 'total')
      .where('W.status = :status', { status: WithdrawalStatus.paid })
      .getRawOne();
    return data?.total || 0;
  }

  findOne(id: string): Promise<Withdrawal> {
    return this.withdrawalRepo.findOne({ where: { id }, relations: ['account', 'account.user'] });
  }

  async update(id: string, updateWithdrawal: UpdateWithdrawal): Promise<Withdrawal> {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      await queryRunner.manager.update(WithdrawalEntity, id, updateWithdrawal);

      const withdrawal = await this.findOne(id);

      if (updateWithdrawal.status === WithdrawalStatus.paid) {
        await this.accountService
          .increaseBalance(withdrawal.account.id, withdrawal.amount, queryRunner);
      }

      const { user } = withdrawal.account;

      if (updateWithdrawal.status === WithdrawalStatus.paid) {
        await this.accountService.increaseBalance(withdrawal.account.id, withdrawal.amount, queryRunner);
        this.emailService.sendMail(user.email, 'Withdrawal Confirmed', './user/withdrawal-confirmed', {
          name: user.name,
          amount: formatCurrency(withdrawal.amount),
        }).catch(error => {
          this.logger.error("Failed to send email:", error);
        });
      }

      if (updateWithdrawal.status === WithdrawalStatus.cancelled) {
        this.emailService.sendMail(user.email, 'Withdrawal Rejected', './user/withdrawal-rejected', {
          name: user.name,
          amount: formatCurrency(withdrawal.amount),
        }).catch(error => {
          this.logger.error("Failed to send email:", error);
        });
      }

      await this.transactionService.update(withdrawal.id, updateWithdrawal, queryRunner);

      return withdrawal;
    });
  }

  async remove(id: string) {
    await this.transactionService.remove(id);
    return this.withdrawalRepo.delete(id);
  }
}
