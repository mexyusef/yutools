// src/types/agent.ts
import { Instrument } from "./instrument";
import { State } from "./state";

export abstract class Agent {
  id: string;
  goals: string[];
  instruments: Instrument[];

  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    this.id = config.id;
    this.goals = config.goals;
    this.instruments = config.instruments || [];
  }

  setGoals(goals: string[]): void {
    this.goals = goals;
  }

  abstract processTasks(): Promise<void>;
}