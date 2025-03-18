import { Global, Module } from '@nestjs/common';
import { DBTransactionService } from './db-transaction.service';

@Global()
@Module({
  providers: [DBTransactionService],
  exports: [DBTransactionService]
})
export class CommonModule {}
