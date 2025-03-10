import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import path from 'path';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { environment } from '../../environments/environment';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: environment.email,
        defaults: {
          from: `"${environment.appName}" <${environment.email.auth.user}>`,
        },
        template: {
          dir: path.join(environment.assetsPath, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
          partialsDir: path.join(environment.assetsPath, 'templates', 'partials'),
        },
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
