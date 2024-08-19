import { Injectable } from '@nestjs/common';
import { CreateTradeAssetDto } from './dto/create-trade-asset.dto';
import { UpdateTradeAssetDto } from './dto/update-trade-asset.dto';

@Injectable()
export class TradeAssetService {
  create(createTradeAssetDto: CreateTradeAssetDto) {
    return 'This action adds a new tradeAsset';
  }

  findAll() {
    return `This action returns all tradeAsset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tradeAsset`;
  }

  update(id: number, updateTradeAssetDto: UpdateTradeAssetDto) {
    return `This action updates a #${id} tradeAsset`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradeAsset`;
  }
}
