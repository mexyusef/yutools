import { Agent, Instrument } from "../../types";
import { CampaignCreationInstrument } from "./CampaignCreationInstrument";

export class CampaignAgent extends Agent {
  constructor(config: { id: string; goals: string[]; instruments?: Instrument[] }) {
    super(config);
  }

  async processTasks(): Promise<void> {
    for (const goal of this.goals) {
      if (goal.includes("Create") || goal.includes("Execute")) {
        const campaignCreationInstrument = this.instruments.find(
          (instrument) => instrument.name === "campaign-creation"
        ) as CampaignCreationInstrument | undefined;

        if (campaignCreationInstrument) {
          console.log(`CampaignAgent (${this.id}): Working on goal - ${goal}`);
          await campaignCreationInstrument.handler(goal);
        } else {
          console.error(`CampaignAgent (${this.id}): No campaign creation instrument found`);
        }
      }
    }
  }
}