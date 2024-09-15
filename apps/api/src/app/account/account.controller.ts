import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards';
import { CurrentUser, Roles } from '../../decorators';
import { AccountType, KYCStatus, User, UserRole } from '@coinvant/types';
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('Account Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @Roles(UserRole.user)
  create(@CurrentUser() user: User) {
    if (user.accounts.find(a => a.type === AccountType.live)) {
      throw new BadRequestException('You already have a live account');
    }
    if (user.kycStatus !== KYCStatus.verified) {
      throw new BadRequestException('Please verify your identity first');
    }
    return this.accountService.create({
      type: AccountType.live,
      user,
    });
  }

  @Get(':userID')
  @Roles(UserRole.admin)
  find(@Param('userID') userID: string) {
    return this.accountService.find(userID);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
