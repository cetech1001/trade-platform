import { Injectable } from '@nestjs/common';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {TradeEntity} from "./entities/trade.entity";
import {Repository} from "typeorm";

@Injectable()
export class TradeService {
  constructor(@InjectRepository(TradeEntity) private tradeRepo: Repository<TradeEntity>) {}

  create(createTradeDto: CreateTradeDto) {
    return this.tradeRepo.save(createTradeDto);
  }

  findAll() {
    return this.tradeRepo.find();
  }

  findOne(id: string) {
    return this.tradeRepo.findOne({ where: { id } });
  }

  update(id: string, updateTradeDto: UpdateTradeDto) {
    return this.tradeRepo.update(id, updateTradeDto);
  }

  remove(id: string) {
    return this.tradeRepo.delete(id);
  }
}
