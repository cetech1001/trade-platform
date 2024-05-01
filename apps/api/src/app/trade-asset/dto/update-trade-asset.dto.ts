import { PartialType } from '@nestjs/swagger';
import { CreateTradeAssetDto } from './create-trade-asset.dto';

export class UpdateTradeAssetDto extends PartialType(CreateTradeAssetDto) {}
