import { Agent } from "./types/agent";
import { WebSearchInstrument } from "./instruments/web-search";
import { TopicGenerationInstrument } from "./instruments/topic-generation";

export class TopicSelectionAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Select") || goal.includes("Research")) {
        const webSearchInstrument = this.instruments.find(
          (instrument) => instrument.name === "web-search"
        ) as WebSearchInstrument | undefined;

        const topicGenerationInstrument = this.instruments.find(
          (instrument) => instrument.name === "topic-generation"
        ) as TopicGenerationInstrument | undefined;

        if (webSearchInstrument && topicGenerationInstrument) {
          console.log(`TopicSelectionAgent (${this.id}): Working on goal - ${goal}`);
          await webSearchInstrument.handler(goal);
          await topicGenerationInstrument.handler(goal);
        } else {
          console.error(`TopicSelectionAgent (${this.id}): No required instruments found`);
        }
      }
    }
  }
}