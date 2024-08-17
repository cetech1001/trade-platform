import {Controller, Get, Query, UseGuards, Request} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {PaginationOptionsDto} from "../../dto/pagination.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";

@ApiTags('Transaction Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(@Query() options: PaginationOptionsDto, @Request() req) {
    return this.transactionService.findAll(options, req.user);
  }
}
