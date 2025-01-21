import { Agent } from "./types/agent";
import { OutlineGenerationInstrument } from "./instruments/outline-generation";
import { FileOperationsInstrument } from "./instruments/file-operations";

export class OutlineCreationAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Generate") || goal.includes("Organize")) {
        const outlineGenerationInstrument = this.instruments.find(
          (instrument) => instrument.name === "outline-generation"
        ) as OutlineGenerationInstrument | undefined;

        const fileOperationsInstrument = this.instruments.find(
          (instrument) => instrument.name === "file-operations"
        ) as FileOperationsInstrument | undefined;

        if (outlineGenerationInstrument && fileOperationsInstrument) {
          console.log(`OutlineCreationAgent (${this.id}): Working on goal - ${goal}`);
          await outlineGenerationInstrument.handler(goal);
          await fileOperationsInstrument.handler(goal);
        } else {
          console.error(`OutlineCreationAgent (${this.id}): No required instruments found`);
        }
      }
    }
  }
}