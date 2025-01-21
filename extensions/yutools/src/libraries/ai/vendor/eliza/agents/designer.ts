// src/agents/designer.ts
import { Agent, Instrument } from "../types";
import { DesignInstrument } from "../instruments";

export class DesignerAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Design") || goal.includes("Create")) {
        // Use the design instrument to create designs
        const designInstrument = this.instruments.find(
          (instrument) => instrument.name === "design"
        ) as DesignInstrument | undefined;

        if (designInstrument) {
          console.log(`DesignerAgent (${this.id}): Working on goal - ${goal}`);
          await designInstrument.handler(goal);
        } else {
          console.error(`DesignerAgent (${this.id}): No design instrument found`);
        }
      }
    }
  }
}