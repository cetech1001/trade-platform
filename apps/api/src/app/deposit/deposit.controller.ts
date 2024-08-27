import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Query, UseGuards, UploadedFile,
} from '@nestjs/common';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import {PaginationOptionsDto} from "../../dto/pagination.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {ApiFile, CurrentUser, Roles} from "../../decorators";
import {User, UserRole} from "@coinvant/types";

@ApiTags('Deposit Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post()
  @ApiFile(
      'proof',
      ['proof', 'paymentMethod', 'amount'],
      {
        paymentMethod: {
          type: 'string',
        },
        amount: {
          type: 'string',
        },
      })
  create(@UploadedFile() file: Express.Multer.File,
         @Body() createDepositDto: CreateDepositDto,
         @CurrentUser() user: User) {
    return this.depositService.create(file, createDepositDto, user);
  }

  @Get()
  findAll(@Query() query: PaginationOptionsDto, @CurrentUser() user: User) {
    return this.depositService.findAll(query, user);
  }

  @Get('total/amount')
  @Roles(UserRole.admin)
  fetchTotalDepositAmount() {
    return this.depositService.fetchTotalDepositAmount();
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  update(@Param('id') id: string, @Body() updateDepositDto: UpdateDepositDto) {
    return this.depositService.update(id, updateDepositDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  remove(@Param('id') id: string) {
    return this.depositService.remove(id);
  }
}
