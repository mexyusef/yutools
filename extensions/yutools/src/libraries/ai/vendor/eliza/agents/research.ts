import { Agent } from "../types/agent";
import { WebSearchInstrument } from "../instruments/web-search";
import { FileOperationsInstrument } from "../instruments/file-operations";
import { Instrument } from "../types";

export class ResearchAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Gather") || goal.includes("Organize")) {
        const webSearchInstrument = this.instruments.find(
          (instrument) => instrument.name === "web-search"
        ) as WebSearchInstrument | undefined;

        const fileOperationsInstrument = this.instruments.find(
          (instrument) => instrument.name === "file-operations"
        ) as typeof FileOperationsInstrument | undefined;

        if (webSearchInstrument && fileOperationsInstrument) {
          console.log(`ResearchAgent (${this.id}): Working on goal - ${goal}`);
          await webSearchInstrument.handler(goal);
          await fileOperationsInstrument.handler(goal);
        } else {
          console.error(`ResearchAgent (${this.id}): No required instruments found`);
        }
      }
    }
  }
}