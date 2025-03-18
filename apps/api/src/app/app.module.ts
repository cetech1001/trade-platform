import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environments/environment';
import { TradeModule } from './trade/trade.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { DepositModule } from './deposit/deposit.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { TransactionModule } from './transaction/transaction.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TradeAssetModule } from './trade-asset/trade-asset.module';
import { EmailModule } from './email/email.module';
import { AccountModule } from './account/account.module';
import { OTPModule } from './otp/otp.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: environment.assetsPath,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(environment.db),
    TradeModule,
    PaymentMethodModule,
    DepositModule,
    WithdrawalModule,
    TransactionModule,
    TradeAssetModule,
    EmailModule,
    AccountModule,
    OTPModule,
    CommonModule,
  ],
})
export class AppModule {}
