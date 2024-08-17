import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environment/environment';
import { TradeModule } from './trade/trade.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { DepositModule } from './deposit/deposit.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(environment.db),
    TradeModule,
    PaymentMethodModule,
    DepositModule,
    WithdrawalModule,
    TransactionModule,
  ],
})
export class AppModule {}
