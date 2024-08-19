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
import { ServeStaticModule } from '@nestjs/serve-static';
import { TradeAssetModule } from './trade-asset/trade-asset.module';
import path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'apps', 'api', 'src', 'assets'),
    }),
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(environment.db),
    TradeModule,
    PaymentMethodModule,
    DepositModule,
    WithdrawalModule,
    TransactionModule,
    TradeAssetModule,
  ],
})
export class AppModule {}
