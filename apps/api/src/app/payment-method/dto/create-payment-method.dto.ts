import {OmitType} from "@nestjs/swagger";
import {PaymentMethodEntity} from "../entities/payment-method.entity";
import {CreatePaymentMethod} from "@coinvant/types";

export class CreatePaymentMethodDto
	extends OmitType(PaymentMethodEntity, ["id"])
	implements CreatePaymentMethod {}
