import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {WithdrawalEntity} from "./entities/withdrawal.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {
  CreateWithdrawal,
  PaginationOptions,
  TransactionType,
  UpdateWithdrawal,
  User,
  UserRole,
  Withdrawal
} from "@coinvant/types";
import {paginate, Pagination} from "nestjs-typeorm-paginate";
import {TransactionService} from "../transaction/transaction.service";

@Injectable()
export class WithdrawalService {
  constructor(
      @InjectRepository(WithdrawalEntity) private readonly withdrawalRepo:
          Repository<WithdrawalEntity>,
      private readonly transactionService: TransactionService) {}

  async create(createWithdrawal: CreateWithdrawal, user: User): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepo.save({
      ...createWithdrawal,
      user,
    });
    await this.transactionService.create({
      amount: withdrawal.amount,
      type: TransactionType.withdrawal,
      status: withdrawal.status,
      transactionID: withdrawal.id,
      user,
    });
    return withdrawal;
  }

  findAll(options: PaginationOptions, user: User): Promise<Pagination<Withdrawal>> {
    const searchOptions = {};

    if (user.role === UserRole.user) {
      searchOptions['where'] = { user: { id: user.id } };
    }

    return paginate(this.withdrawalRepo, options, searchOptions);
  }

  findOne(id: string): Promise<Withdrawal> {
    return this.withdrawalRepo.findOne({ where: { id } });
  }

  async update(id: string, updateWithdrawal: UpdateWithdrawal): Promise<Withdrawal> {
    await this.withdrawalRepo.update(id, updateWithdrawal);
    const withdrawal = await this.findOne(id);
    await this.transactionService.update(withdrawal.id, updateWithdrawal);
    return withdrawal;
  }

  async remove(id: string) {
    await this.transactionService.remove(id);
    return this.withdrawalRepo.delete(id);
  }
}
