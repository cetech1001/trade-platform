import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, Query, ForbiddenException, UploadedFiles
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards";
import {PaginationOptionsDto} from "../../dto/pagination.dto";
import {User, UserRole} from "@coinvant/types";
import { CurrentUser, Roles } from '../../decorators';
import { CreateKycDto } from './dto/create-kyc.dto';
import { ApiFiles } from '../../decorators/api-file-fields.decorator';
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('User Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return this.userService.findOne({ id: user.id });
  }

  @Get()
  @Roles(UserRole.admin)
  findAll(@Query() options: PaginationOptionsDto) {
    return this.userService.findAll(options);
  }

  @Get('kyc/search')
  @Roles(UserRole.admin)
  findKYC(@Query() options: PaginationOptionsDto) {
    return this.userService.findKYC(options);
  }

  @Get(':id')
  @Roles(UserRole.admin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne({id});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User) {
    if (user.role !== 'admin') {
      if (user.id !== id) {
        throw new ForbiddenException('Access Forbidden');
      }
      if (updateUserDto.role) {
        delete updateUserDto.role;
      }
    }
    return this.userService.update(id, updateUserDto);
  }

  @Post('kyc')
  @ApiFiles(
  ['photo', 'idCard', 'proofOfAddress'],
  [
    'photo',
    'idCard',
    'proofOfAddress',
    'firstName',
    'lastName',
    'dob',
    'nationality',
    'residentialAddress'
  ],
  {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    dob: {
      type: 'string',
    },
    nationality: {
      type: 'string',
    },
    residentialAddress: {
      type: 'string',
    },
  })
  uploadKYC(@UploadedFiles() files: Express.Multer.File[], @Body() createKycDto: CreateKycDto, @CurrentUser() user: User) {
    return this.userService.uploadKYC(files, createKycDto, user);
  }

  @Delete('kyc/:id')
  @Roles(UserRole.admin)
  removeKYC(@Param('id') id: string) {
    return this.userService.removeKYC(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
