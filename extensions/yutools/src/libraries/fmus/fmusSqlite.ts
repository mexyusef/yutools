import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { FMUSParser, FMUSItem } from './fmusParser';

export class FMUSSqlite {
  private db: Database<sqlite3.Database, sqlite3.Statement>;

  constructor(private dbFilePath: string) {}

  async connect(): Promise<void> {
    this.db = await open({
      filename: this.dbFilePath,
      driver: sqlite3.Database,
    });

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS fmus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        header TEXT NOT NULL,
        body TEXT NOT NULL
      );
    `);
  }

  async saveFMUS(fmusItems: FMUSItem[]): Promise<void> {
    const insertStmt = await this.db.prepare(
      `INSERT INTO fmus (header, body) VALUES (?, ?)`
    );

    try {
      await this.db.exec('BEGIN TRANSACTION;');
      for (const item of fmusItems) {
        await insertStmt.run(item.header, item.body);
      }
      await this.db.exec('COMMIT;');
    } catch (err) {
      await this.db.exec('ROLLBACK;');
      throw err;
    } finally {
      await insertStmt.finalize();
    }
  }

  async loadFMUS(): Promise<FMUSItem[]> {
    const rows = await this.db.all('SELECT header, body FROM fmus;');
    return rows.map(row => ({ header: row.header, body: row.body }));
  }

  async importFromFile(filePath: string): Promise<void> {
    const fmusItems = FMUSParser.parseFile(filePath);
    await this.saveFMUS(fmusItems);
  }

  async exportToFile(filePath: string): Promise<void> {
    const fmusItems = await this.loadFMUS();
    FMUSParser.writeToFile(filePath, fmusItems);
  }

  async close(): Promise<void> {
    await this.db.close();
  }
}
