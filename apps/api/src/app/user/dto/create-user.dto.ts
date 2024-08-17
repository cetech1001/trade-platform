import {OmitType} from "@nestjs/swagger";
import {UserEntity} from "../entities/user.entity";
import {CreateUser} from "@coinvant/types";

export class CreateUserDto
	extends OmitType(UserEntity, ['id'])
	implements CreateUser{}
