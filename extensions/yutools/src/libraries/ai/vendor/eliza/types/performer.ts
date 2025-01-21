import { Instrument } from "./instrument";
import { Memory } from "./memory";
import { State } from "./state";

export interface PerformerConfig {
  id: string; // Unique identifier for the performer
  // goals: string[]; // Goals or objectives of the performer
  goals?: string[];
  instruments?: Instrument[]; // Instruments available to the performer
}

export interface PerformerState extends State {
  performerId: string; // ID of the performer
  recentMessages: Memory[]; // Recent messages in the conversation
  goals: string[]; // Current goals of the performer
}