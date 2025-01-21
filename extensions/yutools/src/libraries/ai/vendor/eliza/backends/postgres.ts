import { Pool } from "pg";
import { StorageBackend } from "./base-backend";
import { Memory } from "../types";

export class PostgresBackend implements StorageBackend {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async createMemory(memory: Memory): Promise<void> {
    await this.pool.query(
      "INSERT INTO memories (id, content, userId, roomId, createdAt, embedding) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        memory.id,
        JSON.stringify(memory.content),
        memory.userId,
        memory.roomId,
        memory.createdAt,
        memory.embedding,
      ]
    );
  }

  async getRecentMessages(roomId: string, count: number = 10): Promise<Memory[]> {
    const result = await this.pool.query(
      "SELECT * FROM memories WHERE roomId = $1 ORDER BY createdAt DESC LIMIT $2",
      [roomId, count]
    );
    return result.rows.map((row) => ({
      id: row.id,
      content: JSON.parse(row.content),
      userId: row.userId,
      roomId: row.roomId,
      createdAt: new Date(row.createdat),
      embedding: row.embedding,
    }));
  }

  async searchMemoriesByEmbedding(
    embedding: number[],
    opts: { roomId: string; threshold?: number; count?: number }
  ): Promise<Memory[]> {
    const result = await this.pool.query(
      "SELECT * FROM memories WHERE roomId = $1 ORDER BY embedding <-> $2 LIMIT $3",
      [opts.roomId, embedding, opts.count || 10]
    );
    return result.rows.map((row) => ({
      id: row.id,
      content: JSON.parse(row.content),
      userId: row.userId,
      roomId: row.roomId,
      createdAt: new Date(row.createdat),
      embedding: row.embedding,
    }));
  }

  async deleteMemory(memoryId: string): Promise<void> {
    await this.pool.query("DELETE FROM memories WHERE id = $1", [memoryId]);
  }
}