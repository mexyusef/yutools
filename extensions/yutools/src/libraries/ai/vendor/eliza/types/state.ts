import { StorageBackend } from "../backends";
import { Memory } from "./memory";

export interface State {
  performerId: string; // ID of the performer (agent) managing the state
  recentMessages: Memory[]; // Recent messages in the conversation
  goals: string[]; // Current goals or objectives of the performer
  storageBackend: StorageBackend; // Storage backend for memory operations
  [key: string]: any; // Additional context or custom state properties
}