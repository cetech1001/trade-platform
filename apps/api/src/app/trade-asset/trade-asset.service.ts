import { Injectable } from '@nestjs/common';
import { CreateTradeAssetDto } from './dto/create-trade-asset.dto';
import { UpdateTradeAssetDto } from './dto/update-trade-asset.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {TradeAssetEntity} from "./entities/trade-asset.entity";
import {Repository} from "typeorm";

@Injectable()
export class TradeAssetService {
  constructor(@InjectRepository(TradeAssetEntity) private tradeAssetRepo: Repository<TradeAssetEntity>) {}

  create(createTradeAssetDto: CreateTradeAssetDto) {
    return this.tradeAssetRepo.save(createTradeAssetDto);
  }

  findAll() {
    return this.tradeAssetRepo.find();
  }

  findOne(id: string) {
    return this.tradeAssetRepo.findOne({ where: { id } });
  }

  update(id: string, updateTradeAssetDto: UpdateTradeAssetDto) {
    return this.tradeAssetRepo.update(id, updateTradeAssetDto);
  }

  remove(id: string) {
    return this.tradeAssetRepo.delete(id);
  }
}
