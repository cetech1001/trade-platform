import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { QueryRunner, Repository } from 'typeorm';
import {
  AccountType,
  CreateAccount,
  UpdateAccount,
  UserRole,
} from '@coinvant/types';
import { DecimalHelper } from '../../helpers/decimal';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepo: Repository<AccountEntity>
  ) {}

  async create(
    createAccount: CreateAccount,
    queryRunner?: QueryRunner,
    userID?: string
  ) {
    const accountExists = await this.accountRepo.findOne({
      where: {
        user: { id: createAccount.user.id || userID },
        type: createAccount.type,
      },
    });

    if (accountExists) {
      throw new BadRequestException(
        `User already has a ${accountExists.type} account`
      );
    }

    if (createAccount.user.role === UserRole.admin) {
      return this.accountRepo.save({
        type: AccountType.live,
        user: userID as any,
      });
    }

    if (queryRunner) {
      return queryRunner.manager.save(AccountEntity, createAccount);
    }
    return this.accountRepo.save(createAccount);
  }

  async find(userID: string) {
    const accounts = await this.accountRepo.find({
      where: { user: { id: userID } },
    });
    if (accounts.length === 0) {
      throw new BadRequestException('No accounts found for this user.');
    }
    return accounts;
  }

  async findOne(id: string) {
    const account = await this.accountRepo.findOneBy({ id });
    if (!account) {
      throw new BadRequestException('Account does not exist');
    }
    return account;
  }

  async findOneForUpdate(id: string, queryRunner: QueryRunner) {
    const account = await queryRunner.manager.findOne(AccountEntity, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });
    if (!account) {
      throw new BadRequestException('Account does not exist');
    }
    return account;
  }

  async update(
    id: string,
    updateAccount: UpdateAccount,
    queryRunner?: QueryRunner
  ) {
    if (updateAccount.walletBalance) {
      updateAccount.walletBalance = DecimalHelper.normalize(
        updateAccount.walletBalance
      );
    }
    if (queryRunner) {
      await queryRunner.manager.update(AccountEntity, id, updateAccount);
    } else {
      await this.accountRepo.update(id, updateAccount);
    }
    return this.findOne(id);
  }

  async increaseBalance(id: string, amount: number, queryRunner: QueryRunner) {
    // Lock the account row to prevent concurrent updates
    const account = await this.findOneForUpdate(id, queryRunner);

    // Use DecimalHelper for precise calculations
    const normalizedAmount = DecimalHelper.normalize(amount);
    const currentBalance = DecimalHelper.normalize(account.walletBalance);
    const newBalance = DecimalHelper.add(currentBalance, normalizedAmount);

    // Validate balance doesn't become negative due to floating point issues
    if (DecimalHelper.isLessThan(newBalance, 0)) {
      throw new BadRequestException(
        'Operation would result in negative balance'
      );
    }

    await queryRunner.manager.update(
      AccountEntity,
      { id },
      { walletBalance: newBalance }
    );
  }

  async decreaseBalance(id: string, amount: number, queryRunner: QueryRunner) {
    // Lock the account row to prevent concurrent updates
    const account = await this.findOneForUpdate(id, queryRunner);

    // Use DecimalHelper for precise calculations
    const currentBalance = DecimalHelper.normalize(account.walletBalance);
    const amountToDecrease = DecimalHelper.normalize(amount);

    if (DecimalHelper.isLessThan(currentBalance, amountToDecrease)) {
      throw new BadRequestException('Insufficient funds');
    }

    const newBalance = DecimalHelper.subtract(currentBalance, amountToDecrease);

    await queryRunner.manager.update(
      AccountEntity,
      { id },
      { walletBalance: newBalance }
    );
  }

  remove(id: string) {
    return this.accountRepo.delete(id);
  }
}
