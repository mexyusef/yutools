import { Database } from 'better-sqlite3';
import { FMUSParser, FMUSItem } from './fmusParser';

export class FMUSSqliteBetter {
  private db: Database;

  constructor(private dbFilePath: string) {
    this.db = new Database(this.dbFilePath);
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS fmus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        header TEXT NOT NULL,
        body TEXT NOT NULL
      );
    `);
  }

  saveFMUS(fmusItems: FMUSItem[]): void {
    const insertStmt = this.db.prepare(
      `INSERT INTO fmus (header, body) VALUES (?, ?)`
    );
    const transaction = this.db.transaction((items: FMUSItem[]) => {
      for (const item of items) {
        insertStmt.run(item.header, item.body);
      }
    });

    transaction(fmusItems);
  }

  loadFMUS(): FMUSItem[] {
    const rows = this.db.prepare('SELECT header, body FROM fmus').all();
    return rows.map(row => ({ header: row.header, body: row.body }));
  }

  importFromFile(filePath: string): void {
    const fmusItems = FMUSParser.parseFile(filePath);
    this.saveFMUS(fmusItems);
  }

  exportToFile(filePath: string): void {
    const fmusItems = this.loadFMUS();
    FMUSParser.writeToFile(filePath, fmusItems);
  }

  close(): void {
    this.db.close();
  }
}
