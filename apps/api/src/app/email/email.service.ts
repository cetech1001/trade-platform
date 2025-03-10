import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { environment } from '../../environments/environment';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(
    email: string,
    subject: string,
    template: string,
    context: Record<string, string>) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        companyName: environment.appName,
        supportEmail: environment.supportEmail,
        ...context,
      },
    });
  }
}
