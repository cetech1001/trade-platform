import {Injectable} from '@nestjs/common';
import {DataSource, Repository} from "typeorm";
import {WithdrawalEntity} from "./entities/withdrawal.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {
  CreateWithdrawal,
  PaginationOptions,
  Transaction,
  TransactionType,
  UpdateWithdrawal,
  User,
  UserRole,
  Withdrawal,
  WithdrawalStatus
} from "@coinvant/types";
import {paginate, Pagination} from "nestjs-typeorm-paginate";
import {TransactionService} from "../transaction/transaction.service";
import {UserService} from "../user/user.service";

@Injectable()
export class WithdrawalService {
  constructor(
      @InjectRepository(WithdrawalEntity) private readonly withdrawalRepo:
          Repository<WithdrawalEntity>,
      private readonly dataSource: DataSource,
      private readonly userService: UserService,
      private readonly transactionService: TransactionService) {}

  async create(createWithdrawal: CreateWithdrawal, user: User): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const withdrawal = await queryRunner.manager.save(WithdrawalEntity, {
        ...createWithdrawal,
        user,
      });
      return this.transactionService.create({
        amount: withdrawal.amount,
        type: TransactionType.withdrawal,
        status: withdrawal.status,
        transactionID: withdrawal.id,
        user,
      }, queryRunner);
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(options: PaginationOptions, user: User): Promise<Pagination<Withdrawal>> {
    const searchOptions = {};

    if (user.role === UserRole.user) {
      searchOptions['where'] = { user: { id: user.id } };
    }

    return paginate(this.withdrawalRepo, options, searchOptions);
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
        await this.userService.update(withdrawal.user.id, {
          walletBalance: +withdrawal.user.walletBalance - (+withdrawal.amount),
        }, queryRunner);
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
