import { Module } from '@nestjs/common';
import { TradeAssetService } from './trade-asset.service';
import { TradeAssetController } from './trade-asset.controller';

@Module({
  controllers: [TradeAssetController],
  providers: [TradeAssetService],
})
export class TradeAssetModule {}
