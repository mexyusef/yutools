import { Memory } from "../types/memory";

export interface StorageBackend {
  createMemory(memory: Memory): Promise<void>; // Create a new memory
  getRecentMessages(roomId: string, count?: number): Promise<Memory[]>; // Get recent messages for a room
  searchMemoriesByEmbedding(embedding: number[], opts: { roomId: string; threshold?: number; count?: number }): Promise<Memory[]>; // Search memories by embedding
  deleteMemory(memoryId: string): Promise<void>; // Delete a memory by ID
}