import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import { AccountModule } from '../account/account.module';
import { KycEntity } from './entities/kyc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, KycEntity]),
    AccountModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
