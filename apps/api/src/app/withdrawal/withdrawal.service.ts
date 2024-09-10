import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
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

@Injectable()
export class WithdrawalService {
  constructor(
      @InjectRepository(WithdrawalEntity) private readonly withdrawalRepo:
          Repository<WithdrawalEntity>,
      private readonly dataSource: DataSource,
      private readonly accountService: AccountService,
      private readonly transactionService: TransactionService) {}

  async create(createWithdrawal: CreateWithdrawal): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const account = await this.accountService.findOne(createWithdrawal.accountID);
      const withdrawal = await queryRunner.manager.save(WithdrawalEntity, {
        ...createWithdrawal,
        account,
      });
      return await this.transactionService.create({
        amount: withdrawal.amount,
        type: TransactionType.withdrawal,
        status: withdrawal.status,
        transactionID: withdrawal.id,
        account,
      }, queryRunner);
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(query: FindWithdrawalsQueryParams, user: User): Promise<Pagination<Withdrawal>> {
    // eslint-disable-next-line prefer-const
    let { accountID, ...options } = query;
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

    return paginate(queryBuilder, options);
  }

  async fetchTotalWithdrawalAmount() {
    const withdrawals = await this.withdrawalRepo.find();
    return withdrawals.reduce((prev, curr) => {
      if (curr.status === WithdrawalStatus.paid) {
        prev += curr.amount;
      }
      return prev;
    }, 0);
  }

  findOne(id: string): Promise<Withdrawal> {
    return this.withdrawalRepo.findOne({ where: { id } });
  }

  async update(id: string, updateWithdrawal: UpdateWithdrawal): Promise<Withdrawal> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.manager.update(WithdrawalEntity, id, updateWithdrawal);
      const withdrawal = await this.findOne(id);
      if (updateWithdrawal.status === WithdrawalStatus.paid) {
        await this.accountService
          .increaseBalance(withdrawal.account.id, withdrawal.amount, queryRunner);
      }
      await this.transactionService.update(withdrawal.id, updateWithdrawal, queryRunner);
      return withdrawal;
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    await this.transactionService.remove(id);
    return this.withdrawalRepo.delete(id);
  }
}
