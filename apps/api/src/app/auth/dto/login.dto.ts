import {PickType} from "@nestjs/swagger";
import {UserEntity} from "../../user/entities/user.entity";
import {LoginRequest} from "@coinvant/types";

export class LoginDto extends PickType(UserEntity, ['email', 'password']) implements LoginRequest {}

export class SendResetTokenDto extends PickType(UserEntity, ['email']) implements Pick<LoginRequest, 'email'> {}
