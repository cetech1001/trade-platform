import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {Roles} from "../../decorators";
import {UserRole} from "@coinvant/types";
import {TransactionsQueryDto} from "./dto/transactions-query.dto";

@ApiTags('Transaction Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(UserRole.user)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(@Query() options: TransactionsQueryDto) {
    return this.transactionService.findAll(options);
  }
}
