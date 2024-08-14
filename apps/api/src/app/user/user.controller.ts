import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Request, UseGuards, Query, UnauthorizedException, ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {PaginationOptionsDto} from "../../dto/pagination.dto";
import {UserRole} from "@coinvant/types";
import {Roles} from "../../decorators";

@ApiTags('User Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findOne({ id: req.user.id });
  }

  @Get()
  @Roles(UserRole.admin)
  findAll(@Query() options: PaginationOptionsDto) {
    return this.userService.findAll(options);
  }

  @Get(':id')
  @Roles(UserRole.admin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne({id});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw new ForbiddenException('You can only access your own data');
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
