import { Instrument } from "../../types";
import { CampaignService } from "./CampaignService";

export class CampaignCreationInstrument implements Instrument {
  name = "campaign-creation";
  description = "Creates and executes marketing campaigns";
  private campaignService: CampaignService;

  constructor(campaignService: CampaignService) {
    this.campaignService = campaignService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Create") || task.includes("Execute")) {
      const prompt = "Create a campaign for our new product";
      const campaign = await this.campaignService.createCampaign(prompt);
      console.log(`Generated campaign: ${campaign}`);
    }
  }
}