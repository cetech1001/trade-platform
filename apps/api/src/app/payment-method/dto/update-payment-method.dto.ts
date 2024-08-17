import { PartialType } from '@nestjs/swagger';
import { CreatePaymentMethodDto } from './create-payment-method.dto';
import {UpdatePaymentMethod} from "@coinvant/types";

export class UpdatePaymentMethodDto
	extends PartialType(CreatePaymentMethodDto)
	implements UpdatePaymentMethod{}
