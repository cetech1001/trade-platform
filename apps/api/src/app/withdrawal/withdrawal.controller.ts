import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, Query,
} from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {PaginationOptionsDto} from "../../dto/pagination.dto";
import {CurrentUser, Roles} from "../../decorators";
import {User, UserRole} from "@coinvant/types";

@ApiTags('Withdrawal Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Post()
  @Roles(UserRole.user)
  create(@Body() createWithdrawalDto: CreateWithdrawalDto, @CurrentUser() user: User) {
    return this.withdrawalService.create(createWithdrawalDto, user);
  }

  @Get()
  @Roles(UserRole.admin)
  findAll(@Query() options: PaginationOptionsDto, @CurrentUser() user: User) {
    return this.withdrawalService.findAll(options, user);
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
