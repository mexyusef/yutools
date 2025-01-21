import { Agent, Instrument } from "../types";
import { CodeGenerationInstrument } from "../instruments";

export class DeveloperAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Implement") || goal.includes("Fix")) {
        // Use the code generation instrument to write code
        const codeGenerationInstrument = this.instruments.find(
          (instrument) => instrument.name === "code-generation"
        ) as CodeGenerationInstrument | undefined;

        if (codeGenerationInstrument) {
          console.log(`DeveloperAgent (${this.id}): Working on goal - ${goal}`);
          // await codeGenerationInstrument.handler(goal);
          try {
            await codeGenerationInstrument.handler(goal);
          } catch (error) {
            console.error(`DeveloperAgent (${this.id}): Error processing goal - ${goal}`, error);
          }
        } else {
          console.error(`DeveloperAgent (${this.id}): No code generation instrument found`);
        }
      }
    }
  }

}