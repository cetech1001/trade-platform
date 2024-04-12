import {Controller, Post, UseGuards, Request, Get, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {ApiTags} from "@nestjs/swagger";
import {Public} from "../decorators";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {LoginDto} from "./dto/login.dto";

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Body() _: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
      .then(this.authService.login);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
