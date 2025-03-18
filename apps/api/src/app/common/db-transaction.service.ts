import { Global, Injectable, Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Global()
@Injectable()
export class DBTransactionService {
  private readonly logger = new Logger(DBTransactionService.name);

  constructor(private readonly dataSource: DataSource) {
  }

  async executeTransaction<T>(callback: (queryRunner: QueryRunner) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error("Transaction failed: ", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
