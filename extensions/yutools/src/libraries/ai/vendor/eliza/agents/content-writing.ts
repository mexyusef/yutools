import { Agent } from "../types/agent";
import { ContentGenerationInstrument } from "../instruments/content-generation";
import { FileOperationsInstrument } from "../instruments/file-operations";
import { Instrument } from "../types";

export class ContentWritingAgent extends Agent {

  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Write") || goal.includes("Edit")) {
        const contentGenerationInstrument = this.instruments.find(
          (instrument) => instrument.name === "content-generation"
        ) as ContentGenerationInstrument | undefined;

        const fileOperationsInstrument = this.instruments.find(
          (instrument) => instrument.name === "file-operations"
        ) as typeof FileOperationsInstrument | undefined;

        if (contentGenerationInstrument && fileOperationsInstrument) {
          console.log(`ContentWritingAgent (${this.id}): Working on goal - ${goal}`);
          await contentGenerationInstrument.handler(goal);
          await fileOperationsInstrument.handler(goal);
        } else {
          console.error(`ContentWritingAgent (${this.id}): No required instruments found`);
        }
      }
    }
  }

}
