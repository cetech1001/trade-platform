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
import { DBTransactionService } from '../common/db-transaction.service';
import { DecimalHelper } from '../../helpers/decimal';

@Injectable()
export class WithdrawalService {
  private readonly logger = new Logger(WithdrawalService.name);

  constructor(
    @InjectRepository(WithdrawalEntity) private readonly withdrawalRepo:
    Repository<WithdrawalEntity>,
    private readonly dbTransactionService: DBTransactionService,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    private readonly emailService: EmailService) {}

  async create(createWithdrawal: CreateWithdrawal, user: User): Promise<Transaction> {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      const account = await this.accountService.findOne(createWithdrawal.accountID);

      // Validate withdrawal amount
      const withdrawalAmount = DecimalHelper.normalize(createWithdrawal.amount);
      const accountBalance = DecimalHelper.normalize(account.walletBalance);

      if (DecimalHelper.isGreaterThan(withdrawalAmount, accountBalance)) {
        throw new Error('Insufficient funds for withdrawal');
      }

      const withdrawal = await queryRunner.manager.save(WithdrawalEntity, {
        ...createWithdrawal,
        amount: withdrawalAmount,
        account,
      });

      const transaction = await this.transactionService.create({
        amount: withdrawalAmount,
        type: TransactionType.withdrawal,
        status: withdrawal.status,
        transactionID: withdrawal.id,
        account,
      }, queryRunner);

      Promise.all([
        this.emailService.sendMail(user.email, 'Withdrawal Request Received', './user/new-withdrawal', {
          name: user.name,
          amount: formatCurrency(withdrawalAmount),
        }),
        this.emailService.sendMail(environment.supportEmail, 'New Withdrawal Alert', './admin/new-withdrawal', {
          name: user.name,
          amount: formatCurrency(withdrawalAmount),
          method: createWithdrawal.paymentMethod,
        }),
      ]).catch(error => {
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
    return DecimalHelper.normalize(data?.total || 0);
  }

  findOne(id: string): Promise<Withdrawal> {
    return this.withdrawalRepo.findOne({ where: { id }, relations: ['account', 'account.user'] });
  }

  async update(id: string, updateWithdrawal: UpdateWithdrawal): Promise<Withdrawal> {
    return this.dbTransactionService.executeTransaction(async (queryRunner) => {
      await queryRunner.manager.update(WithdrawalEntity, id, updateWithdrawal);

      const withdrawal = await this.findOne(id);
      const { user } = withdrawal.account;
      const withdrawalAmount = DecimalHelper.normalize(withdrawal.amount);

      if (updateWithdrawal.status === WithdrawalStatus.paid) {
        await this.accountService.decreaseBalance(withdrawal.account.id, withdrawalAmount, queryRunner);

        this.emailService.sendMail(user.email, 'Withdrawal Confirmed', './user/withdrawal-confirmed', {
          name: user.name,
          amount: formatCurrency(withdrawalAmount),
        }).catch(error => {
          this.logger.error("Failed to send email:", error);
        });
      }

      if (updateWithdrawal.status === WithdrawalStatus.cancelled) {
        this.emailService.sendMail(user.email, 'Withdrawal Rejected', './user/withdrawal-rejected', {
          name: user.name,
          amount: formatCurrency(withdrawalAmount),
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
