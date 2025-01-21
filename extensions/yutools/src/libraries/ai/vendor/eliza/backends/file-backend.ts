import { StorageBackend } from "./base-backend";
import fs from "fs";
import path from "path";
import { Memory } from "../types";

export class FileBackend implements StorageBackend {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.initializeFile();
  }

  private initializeFile(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  private async readMemories(): Promise<Memory[]> {
    const data = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  private async writeMemories(memories: Memory[]): Promise<void> {
    fs.writeFileSync(this.filePath, JSON.stringify(memories, null, 2));
  }

  async createMemory(memory: Memory): Promise<void> {
    const memories = await this.readMemories();
    memories.push(memory);
    await this.writeMemories(memories);
  }

  async getRecentMessages(roomId: string, count: number = 10): Promise<Memory[]> {
    const memories = await this.readMemories();
    return memories
      .filter((memory) => memory.roomId === roomId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, count);
  }

  async searchMemoriesByEmbedding(
    embedding: number[],
    opts: { roomId: string; threshold?: number; count?: number }
  ): Promise<Memory[]> {
    const memories = await this.readMemories();
    return memories
      .filter((memory) => memory.roomId === opts.roomId)
      .slice(0, opts.count || 10);
  }

  async deleteMemory(memoryId: string): Promise<void> {
    const memories = await this.readMemories();
    const updatedMemories = memories.filter((memory) => memory.id !== memoryId);
    await this.writeMemories(updatedMemories);
  }
}