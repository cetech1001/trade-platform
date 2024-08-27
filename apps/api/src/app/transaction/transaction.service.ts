import {Injectable} from '@nestjs/common';
import {
  CreateTransaction,
  Transaction, TransactionsQuery,
  UpdateTransaction, User
} from "@coinvant/types";
import {QueryRunner, Repository} from "typeorm";
import {TransactionEntity} from "./entities/transaction.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class TransactionService {
  constructor(@InjectRepository(TransactionEntity) private readonly transactionRepo:
                  Repository<TransactionEntity>) {}

  create(createTransaction: CreateTransaction, queryRunner: QueryRunner) {
    return queryRunner.manager.save(TransactionEntity, createTransaction);
  }

  findAll(query: TransactionsQuery, user: User): Promise<Pagination<Transaction>> {
    const { status, type, ...options } = query;
    const queryBuilder = this.transactionRepo.createQueryBuilder('T');

    if (status) {
      queryBuilder.andWhere('T.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('T.type = :type', { type });
    }

    queryBuilder.orderBy('T.createdAt', 'DESC');

    return paginate(queryBuilder, options);
  }

  findByTransactionID(transactionID: string): Promise<Transaction> {
    return this.transactionRepo.findOne({ where: { transactionID } });
  }

  async update(transactionID: string, updateTransaction: UpdateTransaction, queryRunner: QueryRunner) {
    const transaction = await this.findByTransactionID(transactionID);
    return queryRunner.manager.update(TransactionEntity, transaction.id, updateTransaction);
  }

  async remove(transactionID: string) {
    const transaction = await this.findByTransactionID(transactionID);
    return this.transactionRepo.delete(transaction.id);
  }
}
