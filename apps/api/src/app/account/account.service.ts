import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateAccount, UpdateAccount } from '@coinvant/types';

@Injectable()
export class AccountService {
  constructor(@InjectRepository(AccountEntity) private readonly accountRepo: Repository<AccountEntity>) {}

  create(createAccount: CreateAccount, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.save(AccountEntity, createAccount);
    }
    return this.accountRepo.save(createAccount);
  }

  find(userID: string) {
    return this.accountRepo.find({ where: { user: { id: userID } } });
  }

  async findOne(id: string) {
    const account = await this.accountRepo.findOneBy({ id });
    if (!account) {
      throw new BadRequestException("Account does not exist");
    }
    return account;
  }

  async update(id: string, updateAccount: UpdateAccount, queryRunner?: QueryRunner) {
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
    return queryRunner.manager
      .increment(AccountEntity, { id }, 'walletBalance', amount);
  }

  async decreaseBalance(id: string, amount: number, queryRunner: QueryRunner) {
    const accountExists = await this.findOne(id);
    if (!accountExists) {
      throw new BadRequestException('Account does not exist');
    }
    return queryRunner.manager
      .decrement(AccountEntity, { id }, 'walletBalance', amount);
  }

  remove(id: string) {
    return this.accountRepo.delete(id);
  }
}
