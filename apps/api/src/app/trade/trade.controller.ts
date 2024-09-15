import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, Query
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {CurrentUser, Roles} from "../../decorators";
import {User, UserRole} from "@coinvant/types";
import {FindTradeQueryParamsDto} from "./dto/find-trade-query-params.dto";
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('Trade Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Roles(UserRole.user)
  @Post()
  create(@Body() createTradeDto: CreateTradeDto, @CurrentUser() user: User) {
    return this.tradeService.create(createTradeDto, user);
  }

  @Get()
  findAll(@Query() query: FindTradeQueryParamsDto, @CurrentUser() user: User) {
    return this.tradeService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTradeDto: UpdateTradeDto) {
    return this.tradeService.update(id, updateTradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradeService.remove(id);
  }
}
