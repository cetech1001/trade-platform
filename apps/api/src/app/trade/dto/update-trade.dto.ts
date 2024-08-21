import {PickType} from '@nestjs/swagger';
import {UpdateTrade} from "@coinvant/types";
import {TradeEntity} from "../entities/trade.entity";

export class UpdateTradeDto extends PickType(TradeEntity, ['status']) implements UpdateTrade {}
