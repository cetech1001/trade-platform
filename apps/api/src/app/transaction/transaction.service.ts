import {Injectable} from '@nestjs/common';
import {
  CreateTransaction,
  PaginationOptions,
  Transaction,
  UpdateTransaction, User,
  UserRole
} from "@coinvant/types";
import {Repository} from "typeorm";
import {TransactionEntity} from "./entities/transaction.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class TransactionService {
  constructor(@InjectRepository(TransactionEntity) private readonly transactionRepo:
                  Repository<TransactionEntity>) {}

  create(createTransaction: CreateTransaction) {
    return this.transactionRepo.save(createTransaction);
  }

  findAll(options: PaginationOptions, user: User): Promise<Pagination<Transaction>> {
    const searchOptions = {};

    if (user.role === UserRole.user) {
      searchOptions['where'] = { user: { id: user.id } };
    }

    return paginate(this.transactionRepo, options, searchOptions);
  }

  findByTransactionID(transactionID: string): Promise<Transaction> {
    return this.transactionRepo.findOne({ where: { transactionID } });
  }

  async update(transactionID: string, updateTransaction: UpdateTransaction) {
    const transaction = await this.findByTransactionID(transactionID);
    return this.transactionRepo.update(transaction.id, updateTransaction);
  }

  async remove(transactionID: string) {
    const transaction = await this.findByTransactionID(transactionID);
    return this.transactionRepo.delete(transaction.id);
  }
}
