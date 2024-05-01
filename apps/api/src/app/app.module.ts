import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environment/environment';
import { TradeModule } from './trade/trade.module';
import { TradeAssetModule } from './trade-asset/trade-asset.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(environment.db),
    TradeModule,
    TradeAssetModule,
  ],
})
export class AppModule {}
