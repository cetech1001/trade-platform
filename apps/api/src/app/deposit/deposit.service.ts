import {Injectable} from '@nestjs/common';
import {
  CreateDeposit,
  Deposit,
  DepositStatus, FindDepositsQueryParams,
  Transaction,
  TransactionType,
  UpdateDeposit,
  User,
  UserRole
} from '@coinvant/types';
import {paginate, Pagination} from "nestjs-typeorm-paginate";
import {DataSource, Repository} from "typeorm";
import {DepositEntity} from "./entities/deposit.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {TransactionService} from "../transaction/transaction.service";
import {PaymentMethodService} from "../payment-method/payment-method.service";
import { AccountService } from '../account/account.service';

@Injectable()
export class DepositService {
  constructor(
      @InjectRepository(DepositEntity) private readonly depositRepo:
          Repository<DepositEntity>,
      private readonly dataSource: DataSource,
      private readonly accountService: AccountService,
      private readonly paymentMethodService: PaymentMethodService,
      private readonly transactionService: TransactionService) {}

  async create(file: Express.Multer.File, createDeposit: CreateDeposit): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const account = await this.accountService.findOne(createDeposit.accountID);
      const paymentMethod = await this.paymentMethodService.findOne(createDeposit.paymentMethod);
      const deposit = await queryRunner.manager.save(DepositEntity, {
        ...createDeposit,
        paymentMethod: `${paymentMethod.name} - ${paymentMethod.network}`,
        account,
        proof: file.filename,
      });
      return await this.transactionService.create({
        amount: deposit.amount,
        type: TransactionType.deposit,
        status: deposit.status,
        transactionID: deposit.id,
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

  findAll(query: FindDepositsQueryParams, user: User): Promise<Pagination<Deposit>> {
    // eslint-disable-next-line prefer-const
    let { accountID, ...options } = query;
    const queryBuilder = this.depositRepo.createQueryBuilder('D');

    if (user.role === UserRole.admin) {
      queryBuilder
        .leftJoinAndSelect('D.account', 'A')
        .leftJoinAndSelect('A.user', 'U');
    }

    if (user.role === UserRole.user) {
      if (!accountID) {
        accountID = user.accounts[0].id;
      }
      queryBuilder.where('A.id = :accountID', { accountID });
    }

    queryBuilder.orderBy('D.createdAt', 'DESC');

    return paginate(queryBuilder, options);
  }

  async fetchTotalDepositAmount(): Promise<number> {
    const deposits = await this.depositRepo.find();
    return deposits.reduce((prev, curr) => {
      if (curr.status === DepositStatus.confirmed) {
        prev += curr.amount;
      }
      return prev;
    }, 0);
  }

  findOne(id: string): Promise<Deposit> {
    return this.depositRepo.findOne({ where: { id } });
  }

  async update(id: string, updateDeposit: UpdateDeposit): Promise<Deposit> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.manager.update(DepositEntity, id, updateDeposit);
      const deposit = await this.findOne(id);
      if (updateDeposit.status === DepositStatus.confirmed) {
        await this.accountService.increaseBalance(deposit.account.id, deposit.amount, queryRunner);
      }
      await this.transactionService.update(id, updateDeposit, queryRunner);
      return deposit;
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await this.transactionService.remove(id, queryRunner);
    return await queryRunner.manager.delete(DepositEntity, id);
  }
}
