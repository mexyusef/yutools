import { Statement } from 'better-sqlite3';
import { QueryBuilder } from './QueryBuilder';
import { Row } from './Row';
import { TableSchema } from '../schemas/TableSchema';
import { logger } from '@/yubantu/extension/logger';

export class Table<T> {
  private insertStmt: Statement;
  private updateStmt: Statement;
  private deleteStmt: Statement;

  constructor(private db: any, public name: string, private schema: TableSchema<T>) {
    logger.log(`⚡Table constructor STARTED.`);

    // Initialize with dummy values to satisfy TypeScript's strict checks
    this.insertStmt = this.db.prepare('SELECT 1'); // Dummy statement
    this.updateStmt = this.db.prepare('SELECT 1'); // Dummy statement
    this.deleteStmt = this.db.prepare('SELECT 1'); // Dummy statement

    this.createTable();
    logger.log(`⚡Before this.prepareStatements();`);
    this.prepareStatements(); // This will overwrite the dummy statements with valid ones
    logger.log(`⚡Table constructor FINISHED.`);
  }

  // private createTable2(): void {
  //   const columns = Object.entries(this.schema)
  //     .map(([name, options]) => `${name} ${options.type} ${options.primaryKey ? 'PRIMARY KEY' : ''} ${options.autoIncrement ? 'AUTOINCREMENT' : ''}`)
  //     .join(', ');
  //   this.db.exec(`CREATE TABLE IF NOT EXISTS ${this.name} (${columns})`);
  // }
  private createTable(): void {
    logger.log(`createTable`);
    // Convert the schema into a valid SQL column definition string
    const columns = Object.entries(this.schema)
      .map(([name, options]) => {
        let columnDef = `${name} ${options.type}`;
        if (options.primaryKey) columnDef += ' PRIMARY KEY';
        if (options.autoIncrement) columnDef += ' AUTOINCREMENT';
        if (options.required) columnDef += ' NOT NULL';
        if (options.unique) columnDef += ' UNIQUE';
        return columnDef;
      })
      .join(', ');

    // Generate the SQL statement for table creation
    const sql = `CREATE TABLE IF NOT EXISTS ${this.name} (${columns});`;
    console.log(`[Table/createTable] Executing SQL: ${sql}`); // Log the SQL statement for debugging

    try {
      this.db.exec(sql);
      console.log(`Table '${this.name}' created successfully.`);
    } catch (error: any) {
      console.error(`Failed to create table '${this.name}':`, error.message);
      throw new Error(`Table creation failed: ${error.message}`);
    }
  }

  private prepareStatements(): void {
    logger.log(`prepareStatements`);
    const columns = Object.keys(this.schema).join(', ');
    const placeholders = Object.keys(this.schema).map(() => '?').join(', ');
    this.insertStmt = this.db.prepare(`INSERT INTO ${this.name} (${columns}) VALUES (${placeholders})`);
    this.updateStmt = this.db.prepare(`UPDATE ${this.name} SET ${Object.keys(this.schema).map(col => `${col} = ?`).join(', ')} WHERE id = ?`);
    this.deleteStmt = this.db.prepare(`DELETE FROM ${this.name} WHERE id = ?`);
  }

  // insert2(record: Partial<T>): Row<T> {
  //   logger.log(`
  //   inserting ${JSON.stringify(record)}  
  //   `);
  //   const result = this.insertStmt.run(Object.values(record));
  //   return new Row<T>(this, { ...record, id: result.lastInsertRowid } as T);
  // }
  insert(record: Partial<T>): Row<T> {
    logger.log(`Inserting record: ${JSON.stringify(record)}`);

    const values = Object.keys(this.schema).map((key) => {
      if (key in record) {
        return (record as Record<string, any>)[key]; // Use a type assertion
      } else if (this.schema[key].autoIncrement) {
        return null; // Skip auto-increment fields
      } else if (this.schema[key].required) {
        throw new Error(`Missing required field: ${key}`);
      } else {
        return null; // Use null for optional fields
      }
    });

    try {
      const result = this.insertStmt.run(values);
      return new Row<T>(this, { ...record, id: result.lastInsertRowid } as T);
    } catch (error: any) {
      logger.error(`Failed to insert record: ${error.message}`);
      throw new Error(`Insert failed: ${error.message}`);
    }
  }

  find(): QueryBuilder<T> {
    return new QueryBuilder<T>(this.db, this.name);
  }

  // update(id: number, updates: Partial<T>): void {
  //   this.updateStmt.run(...Object.values(updates), id);
  // }

  // delete(id: number): void {
  //   this.deleteStmt.run(id);
  // }
  // Updated update method to support string or number IDs
  update(id: number | string, updates: Partial<T>): void {
    this.updateStmt.run(...Object.values(updates), id);
  }

  delete(id: number | string): void {
    this.deleteStmt.run(id);
  }

}