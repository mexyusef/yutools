import { Agent, Instrument } from "../../types";
import { MarketResearchInstrument } from "./MarketResearchInstrument";

export class MarketResearchAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Research") || goal.includes("Analyze")) {
        const marketResearchInstrument = this.instruments.find(
          (instrument) => instrument.name === "market-research"
        ) as MarketResearchInstrument | undefined;

        if (marketResearchInstrument) {
          console.log(`MarketResearchAgent (${this.id}): Working on goal - ${goal}`);
          await marketResearchInstrument.handler(goal);
        } else {
          console.error(`MarketResearchAgent (${this.id}): No market research instrument found`);
        }
      }
    }
  }
}