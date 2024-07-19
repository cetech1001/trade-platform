import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TradeAssetService } from './trade-asset.service';
import { CreateTradeAssetDto } from './dto/create-trade-asset.dto';
import { UpdateTradeAssetDto } from './dto/update-trade-asset.dto';
import {ApiTags} from "@nestjs/swagger";

@Controller('trade-asset')
@ApiTags('Trade Asset Controller')
export class TradeAssetController {
  constructor(private readonly tradeAssetService: TradeAssetService) {}

  @Post()
  create(@Body() createTradeAssetDto: CreateTradeAssetDto) {
    return this.tradeAssetService.create(createTradeAssetDto);
  }

  @Get()
  findAll() {
    return this.tradeAssetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradeAssetService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTradeAssetDto: UpdateTradeAssetDto
  ) {
    return this.tradeAssetService.update(id, updateTradeAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradeAssetService.remove(id);
  }
}
