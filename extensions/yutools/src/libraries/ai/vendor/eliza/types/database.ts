import { Memory } from "./memory";

export interface DatabaseAdapter {
  createMemory(memory: Memory, unique?: boolean): Promise<void>; // Create a new memory
  getRecentMessages(roomId: string, count?: number): Promise<Memory[]>; // Get recent messages
  searchMemoriesByEmbedding(embedding: number[], opts: { roomId: string; threshold?: number; count?: number }): Promise<Memory[]>; // Search memories by embedding
  deleteMemory(memoryId: string): Promise<void>; // Delete a memory
}