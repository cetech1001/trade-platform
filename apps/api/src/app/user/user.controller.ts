import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Request, UseGuards, Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {PaginationOptionsDto} from "../../dto/pagination.dto";

@ApiTags('User Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findOne({ id: req.user.id });
  }

  @Get()
  findAll(@Query() options: PaginationOptionsDto) {
    return this.userService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({id});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
