// src/agents/tester.ts
import { Agent, Instrument } from "../types";
import { TestingInstrument } from "../instruments";

export class TesterAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Test") || goal.includes("Run tests")) {
        // Use the testing instrument to write or run tests
        const testingInstrument = this.instruments.find(
          (instrument) => instrument.name === "testing"
        ) as TestingInstrument | undefined;

        if (testingInstrument) {
          console.log(`TesterAgent (${this.id}): Working on goal - ${goal}`);
          await testingInstrument.handler(goal);
        } else {
          console.error(`TesterAgent (${this.id}): No testing instrument found`);
        }
      }
    }
  }
}