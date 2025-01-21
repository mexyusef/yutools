import { Agent } from "../types/agent";
import { PublishingInstrument } from "../instruments/publishing";
import { FileOperationsInstrument } from "../instruments/file-operations";
import { Instrument } from "../types";

export class PublishingAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Format") || goal.includes("Publish")) {
        const publishingInstrument = this.instruments.find(
          (instrument) => instrument.name === "publishing"
        ) as PublishingInstrument | undefined;

        const fileOperationsInstrument = this.instruments.find(
          (instrument) => instrument.name === "file-operations"
        ) as typeof FileOperationsInstrument | undefined;

        if (publishingInstrument && fileOperationsInstrument) {
          console.log(`PublishingAgent (${this.id}): Working on goal - ${goal}`);
          await publishingInstrument.handler(goal);
          await fileOperationsInstrument.handler(goal);
        } else {
          console.error(`PublishingAgent (${this.id}): No required instruments found`);
        }
      }
    }
  }
}