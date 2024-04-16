import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {environment} from "../environment/environment";

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(environment.db),
  ],
})
export class AppModule {}
