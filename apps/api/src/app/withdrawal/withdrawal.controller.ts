import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, Query, BadRequestException
} from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {CurrentUser, Roles} from "../../decorators";
import {User, UserRole} from "@coinvant/types";
import { FindWithdrawalsQueryParamsDto } from './dto/find-withdrawals-query-params.dto';
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('Withdrawal Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Post()
  @Roles(UserRole.user)
  create(@Body() createWithdrawalDto: CreateWithdrawalDto, @CurrentUser() user: User) {
    const accountIDs = user.accounts.map(a => a.id);
    if (!accountIDs.includes(createWithdrawalDto.accountID)) {
      throw new BadRequestException('Account ID is invalid');
    }
    return this.withdrawalService.create(createWithdrawalDto, user);
  }

  @Get()
  @Roles(UserRole.admin)
  findAll(@Query() query: FindWithdrawalsQueryParamsDto, @CurrentUser() user: User) {
    return this.withdrawalService.findAll(query, user);
  }

  @Get('total/amount')
  @Roles(UserRole.admin)
  fetchTotalWithdrawalAmount() {
    return this.withdrawalService.fetchTotalWithdrawalAmount();
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  update(
    @Param('id') id: string,
    @Body() updateWithdrawalDto: UpdateWithdrawalDto
  ) {
    return this.withdrawalService.update(id, updateWithdrawalDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  remove(@Param('id') id: string) {
    return this.withdrawalService.remove(id);
  }
}
