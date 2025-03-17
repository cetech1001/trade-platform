import {Injectable} from '@nestjs/common';
import {
  CreateTransaction,
  Transaction, FindTransactionsQueryParams,
  UpdateTransaction, UserRole, User
} from '@coinvant/types';
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

  findAll(query: FindTransactionsQueryParams, user: User): Promise<Pagination<Transaction>> {
    const { status, type, ...options } = query;
    let { accountID } = query;
    const queryBuilder = this.transactionRepo.createQueryBuilder('T');
    queryBuilder.leftJoinAndSelect('T.account', 'A');

    if (user.role === UserRole.admin) {
        queryBuilder.leftJoinAndSelect('A.user', 'U');
    }

    if (user.role === UserRole.user) {
      if (!accountID) {
        accountID = user.accounts[0].id;
      }
      queryBuilder.where('A.id = :accountID', { accountID });
    }

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

  async remove(transactionID: string, queryRunner?: QueryRunner) {
    const transaction = await this.findByTransactionID(transactionID);
    if (queryRunner) {
      return queryRunner.manager.delete(TransactionEntity, transaction.id);
    }
    return this.transactionRepo.delete(transaction.id);
  }
}
