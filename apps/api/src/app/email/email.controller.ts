import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../../guards';
import { RolesGuard } from '../../guards/roles.guard';
import { CurrentUser, Roles } from '../../decorators';
import { User, UserRole } from '@coinvant/types';
import { SupportEmailDto } from './dto/email.dto';
import { environment } from '../../environments/environment';
import { formatDate } from '../../helpers';

@ApiTags('Email Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Roles(UserRole.user)
  @Post('support')
  sendSupportEmail(@Body() supportEmailDto: SupportEmailDto, @CurrentUser() user: User) {
    const ticketID = uuidv4();
    return this.emailService.sendMail(
      environment.supportEmail,
      `Support Ticket | #${ticketID}`,
      './admin/new-support-ticket',
      {
        name: user.name,
        ticketID,
        subject: supportEmailDto.subject,
        issue: supportEmailDto.message,
        submissionDate: formatDate(new Date().toLocaleDateString()),
      });
  }
}
