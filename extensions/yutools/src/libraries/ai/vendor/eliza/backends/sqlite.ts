import { Database } from "sqlite3";
import { StorageBackend } from "./base-backend";
import { Memory } from "../types";

// Define the shape of a row returned by the SQLite query
interface SQLiteMemoryRow {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: number;
  embedding: string;
}

export class SQLiteBackend implements StorageBackend {
  private db: Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        userId TEXT NOT NULL,
        roomId TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        embedding TEXT
      )
    `);
  }

  async createMemory(memory: Memory): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO memories (id, content, userId, roomId, createdAt, embedding) VALUES (?, ?, ?, ?, ?, ?)",
        [
          memory.id,
          JSON.stringify(memory.content),
          memory.userId,
          memory.roomId,
          memory.createdAt.getTime(),
          JSON.stringify(memory.embedding),
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getRecentMessages(roomId: string, count: number = 10): Promise<Memory[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM memories WHERE roomId = ? ORDER BY createdAt DESC LIMIT ?",
        [roomId, count],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Cast rows to the SQLiteMemoryRow type
            const typedRows = rows as SQLiteMemoryRow[];
            const memories = typedRows.map((row) => ({
              id: row.id,
              content: JSON.parse(row.content),
              userId: row.userId,
              roomId: row.roomId,
              createdAt: new Date(row.createdAt),
              embedding: JSON.parse(row.embedding),
            }));
            resolve(memories);
          }
        }
      );
    });
  }

  async searchMemoriesByEmbedding(
    embedding: number[],
    opts: { roomId: string; threshold?: number; count?: number }
  ): Promise<Memory[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM memories WHERE roomId = ? ORDER BY embedding <-> ? LIMIT ?",
        [opts.roomId, JSON.stringify(embedding), opts.count || 10],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Cast rows to the SQLiteMemoryRow type
            const typedRows = rows as SQLiteMemoryRow[];
            const memories = typedRows.map((row) => ({
              id: row.id,
              content: JSON.parse(row.content),
              userId: row.userId,
              roomId: row.roomId,
              createdAt: new Date(row.createdAt),
              embedding: JSON.parse(row.embedding),
            }));
            resolve(memories);
          }
        }
      );
    });
  }

  async deleteMemory(memoryId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM memories WHERE id = ?", [memoryId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}