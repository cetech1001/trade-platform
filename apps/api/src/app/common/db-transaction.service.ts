import { Global, Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Global()
@Injectable()
export class DBTransactionService {
  private readonly logger = new Logger(DBTransactionService.name);

  constructor(private readonly dataSource: DataSource) {}

  async executeTransaction<T>(
    callback: (queryRunner: QueryRunner) => Promise<T>,
    retries = 3
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= retries; attempt++) {
      const queryRunner = this.dataSource.createQueryRunner();

      try {
        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE'); // Use SERIALIZABLE for trade operations

        const result = await callback(queryRunner);

        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        lastError = error;

        this.logger.error(`Transaction failed (attempt ${attempt}/${retries}):`, error);

        // If it's a deadlock or lock timeout, retry
        if (attempt < retries && this.isRetryableError(error)) {
          await this.delay(attempt * 100); // Exponential backoff
          continue;
        }

        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    throw lastError;
  }

  private isRetryableError(error: any): boolean {
    // MySQL/MariaDB deadlock error codes
    return error.code === 'ER_LOCK_DEADLOCK' ||
      error.code === 'ER_LOCK_WAIT_TIMEOUT' ||
      error.message?.includes('deadlock');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
