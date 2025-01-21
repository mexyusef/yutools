import { Memory } from "../types/memory";

/**
 * Filters memories by room ID.
 */
export function filterMemoriesByRoom(memories: Memory[], roomId: string): Memory[] {
  return memories.filter((memory) => memory.roomId === roomId);
}

/**
 * Sorts memories by creation date (newest first).
 */
export function sortMemoriesByDate(memories: Memory[]): Memory[] {
  return memories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}