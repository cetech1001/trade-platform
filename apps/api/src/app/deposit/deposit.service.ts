import {Injectable} from '@nestjs/common';
import {
  CreateDeposit,
  Deposit,
  DepositStatus,
  PaginationOptions,
  Transaction,
  TransactionType,
  UpdateDeposit,
  User,
  UserRole
} from "@coinvant/types";
import {paginate, Pagination} from "nestjs-typeorm-paginate";
import {DataSource, Repository} from "typeorm";
import {DepositEntity} from "./entities/deposit.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {TransactionService} from "../transaction/transaction.service";
import {PaymentMethodService} from "../payment-method/payment-method.service";
import {UserService} from "../user/user.service";

@Injectable()
export class DepositService {
  constructor(
      @InjectRepository(DepositEntity) private readonly depositRepo:
          Repository<DepositEntity>,
      private readonly dataSource: DataSource,
      private readonly userService: UserService,
      private readonly paymentMethodService: PaymentMethodService,
      private readonly transactionService: TransactionService) {}

  async create(file: Express.Multer.File, createDeposit: CreateDeposit, user: User): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      const paymentMethod = await this.paymentMethodService.findOne(createDeposit.paymentMethod);
      const deposit = await queryRunner.manager.save(DepositEntity, {
        ...createDeposit,
        paymentMethod: `${paymentMethod.name} - ${paymentMethod.network}`,
        user,
        proof: file.filename,
      });
      return this.transactionService.create({
        amount: deposit.amount,
        type: TransactionType.deposit,
        status: deposit.status,
        transactionID: deposit.id,
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

  findAll(options: PaginationOptions, user: User): Promise<Pagination<Deposit>> {
    const searchOptions = {};

    if (user.role === UserRole.user) {
      searchOptions['where'] = { user: { id: user.id } };
    }

    return paginate(this.depositRepo, options, searchOptions);
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
        await this.userService.update(deposit.user.id, {
          walletBalance: +deposit.user.walletBalance + (+deposit.amount),
        }, queryRunner);
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
    await this.transactionService.remove(id);
    return this.depositRepo.delete(id);
  }
}
