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
      }
    });

    if (accountExists) {
      throw new BadRequestException(`User already has a ${accountExists.type} account`);
    }

    if (createAccount.user.role === UserRole.admin) {
      return this.accountRepo.save({
        type: AccountType.live,
        user: (userID as any),
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

  async update(
    id: string,
    updateAccount: UpdateAccount,
    queryRunner?: QueryRunner
  ) {
    if (queryRunner) {
      await queryRunner.manager.update(AccountEntity, id, updateAccount);
    } else {
      await this.accountRepo.update(id, updateAccount);
    }
    return this.findOne(id);
  }

  async increaseBalance(id: string, amount: number, queryRunner: QueryRunner) {
    const accountExists = await this.findOne(id);
    if (!accountExists) {
      throw new BadRequestException('Account does not exist');
    }
    return queryRunner.manager.increment(
      AccountEntity,
      { id },
      'walletBalance',
      amount
    );
  }

  async decreaseBalance(id: string, amount: number, queryRunner: QueryRunner) {
    const accountExists = await this.findOne(id);
    if (!accountExists) {
      throw new BadRequestException('Account does not exist');
    }
    return queryRunner.manager.decrement(
      AccountEntity,
      { id },
      'walletBalance',
      amount
    );
  }

  remove(id: string) {
    return this.accountRepo.delete(id);
  }
}
