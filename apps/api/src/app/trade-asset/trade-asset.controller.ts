import {Controller, Get, Put, Query, UseGuards} from '@nestjs/common';
import { TradeAssetService } from './trade-asset.service';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {Roles} from "../../decorators";
import {UserRole} from "@coinvant/types";
import {FindCryptoCurrenciesDto, FindForexPairsDto, FindStockOptionsDto} from "./dto/trade-asset.dto";
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('Trade Asset Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trade-asset')
export class TradeAssetController {
  constructor(private readonly tradeAssetService: TradeAssetService) {}

  @Roles(UserRole.admin)
  @Put('import/stock-options')
  importStockOptions() {
    return this.tradeAssetService.importStockOptions();
  }

  @Roles(UserRole.admin)
  @Put('import/forex-pairs')
  importForexPairs() {
    return this.tradeAssetService.importForexPairs();
  }

  @Roles(UserRole.admin)
  @Put('import/crypto-currencies')
  importCryptoCurrencies() {
    return this.tradeAssetService.importCryptoCurrencies();
  }

  @Get('stock-options')
  findStockOptions(@Query() query: FindStockOptionsDto) {
    return this.tradeAssetService.findStockOptions(query);
  }

  @Get('forex-pairs')
  findForexPairs(@Query() query: FindForexPairsDto) {
    return this.tradeAssetService.findForexPairs(query);
  }

  @Get('crypto-currencies')
  findCryptoCurrencies(@Query() query: FindCryptoCurrenciesDto) {
    return this.tradeAssetService.findCryptoCurrencies(query);
  }
}
