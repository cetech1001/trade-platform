import { CreateKYC } from '@coinvant/types';
import { PickType } from '@nestjs/swagger';
import { KycEntity } from '../entities/kyc.entity';

export class CreateKycDto
  extends PickType(KycEntity, [
    'firstName',
    'lastName',
    'dob',
    'nationality',
    'residentialAddress'
  ]) implements CreateKYC{}
