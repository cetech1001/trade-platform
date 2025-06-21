import { Global, Module } from '@nestjs/common';
import { DBTransactionService } from './db-transaction.service';
import { EnhancedRateLimiterService } from './rate-limiter.service';

@Global()
@Module({
  providers: [DBTransactionService, EnhancedRateLimiterService],
  exports: [DBTransactionService, EnhancedRateLimiterService]
})
export class CommonModule {}
