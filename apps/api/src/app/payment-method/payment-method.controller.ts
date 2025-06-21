import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Query, UseGuards,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import {PaginationOptionsDto} from "../common/dto/pagination.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {Roles} from "../../decorators";
import {UserRole} from "@coinvant/types";
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('Payment Method Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  @Roles(UserRole.admin)
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.paymentMethodService.create(createPaymentMethodDto);
  }

  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    if (query) {
      return this.paymentMethodService.findAll(query);
    }
    return this.paymentMethodService.find();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMethodService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto
  ) {
    return this.paymentMethodService.update(id, updatePaymentMethodDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  remove(@Param('id') id: string) {
    return this.paymentMethodService.remove(id);
  }
}
