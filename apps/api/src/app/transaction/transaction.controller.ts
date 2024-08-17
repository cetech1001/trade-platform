import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {PaginationOptionsDto} from "../../dto/pagination.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {CurrentUser, Roles} from "../../decorators";
import {User, UserRole} from "@coinvant/types";

@ApiTags('Transaction Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(UserRole.user)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(@Query() options: PaginationOptionsDto, @CurrentUser() user: User) {
    return this.transactionService.findAll(options, user);
  }
}
