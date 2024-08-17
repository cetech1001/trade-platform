import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {UpdateUser} from "@coinvant/types";

export class UpdateUserDto
	extends PartialType(CreateUserDto)
	implements UpdateUser{}
