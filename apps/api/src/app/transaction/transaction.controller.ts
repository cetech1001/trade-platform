import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import { CurrentUser, Roles } from '../../decorators';
import { User, UserRole } from '@coinvant/types';
import {FindTransactionsQueryParamsDto} from "./dto/find-transactions-query-params.dto";
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('Transaction Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.user)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(@Query() query: FindTransactionsQueryParamsDto, @CurrentUser() user: User) {
    return this.transactionService.findAll(query, user);
  }
}
