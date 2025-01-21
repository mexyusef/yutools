import { Instrument } from "../../types";
import { MarketResearchService } from "./MarketResearchService";

export class MarketResearchInstrument implements Instrument {
  name = "market-research";
  description = "Conducts market research and competitor analysis";
  private marketResearchService: MarketResearchService;

  constructor(marketResearchService: MarketResearchService) {
    this.marketResearchService = marketResearchService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Research") || task.includes("Analyze")) {
      const query = "market trends for IT startups";
      const results = await this.marketResearchService.researchMarket(query);
      console.log(`Market research results: ${results}`);
    }
  }
}