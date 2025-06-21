import { Global, Module } from '@nestjs/common';
import { DBTransactionService } from './db-transaction.service';
import { RateLimiterService } from './rate-limiter.service';

@Global()
@Module({
  providers: [DBTransactionService, RateLimiterService],
  exports: [DBTransactionService, RateLimiterService]
})
export class CommonModule {}
