import { Memory } from "../types";
import { StorageBackend } from "./base-backend";

export class InMemoryBackend implements StorageBackend {
  private memories: Memory[] = [];

  async createMemory(memory: Memory): Promise<void> {
    this.memories.push(memory);
  }

  async getRecentMessages(roomId: string, count: number = 10): Promise<Memory[]> {
    return this.memories
      .filter((memory) => memory.roomId === roomId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, count);
  }

  async searchMemoriesByEmbedding(
    embedding: number[],
    opts: { roomId: string; threshold?: number; count?: number }
  ): Promise<Memory[]> {
    // Placeholder for embedding search logic
    return this.memories
      .filter((memory) => memory.roomId === opts.roomId)
      .slice(0, opts.count || 10);
  }

  async deleteMemory(memoryId: string): Promise<void> {
    this.memories = this.memories.filter((memory) => memory.id !== memoryId);
  }
}