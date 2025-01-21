import { Database } from 'better-sqlite3'; // Import the type explicitly
import betterSqlite3 from 'better-sqlite3'; // Import the library as a value
import { Table } from './Table';
import { TableSchema } from '../schemas/TableSchema';
import { logger } from '@/yubantu/extension/logger';

export class ZenDB {
  private db: Database;

  constructor(path: string) {
    logger.log(`ZenDB path: ${path}`);

    try {
      // Initialize the database
      this.db = betterSqlite3(path); // Use the value to create a new database instance
      logger.log(`Database successfully opened at: ${path}`);

      // Enable Write-Ahead Logging for better performance
      this.db.pragma('journal_mode = WAL');
      logger.log('Write-Ahead Logging (WAL) enabled.');
    } catch (error: any) {
      logger.error(`Failed to initialize database at ${path}:`, error);
      throw new Error(`Database initialization failed: ${error.message}`);
    }
  }

  table<T>(name: string, schema: TableSchema<T>): Table<T> {
    logger.log(`Creating table '${name}' with schema:`, schema);
    return new Table<T>(this.db, name, schema);
  }

  close(): void {
    try {
      this.db.close();
      logger.log('Database connection closed.');
    } catch (error) {
      logger.error('Failed to close database:', error);
    }
  }
}