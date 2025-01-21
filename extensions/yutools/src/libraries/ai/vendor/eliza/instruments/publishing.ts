import { Instrument } from "../types/instrument";
import { PublishingService } from "../services/publishing-service";

export class PublishingInstrument implements Instrument {
  name = "publishing";
  description = "Handles the publishing process";
  private publishingService: PublishingService;

  constructor(publishingService: PublishingService) {
    this.publishingService = publishingService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Format") || task.includes("Publish")) {
      const content = "Placeholder book content";
      const result = await this.publishingService.publishBook(content);
      console.log(`Publishing result: ${result}`);
    }
  }
}