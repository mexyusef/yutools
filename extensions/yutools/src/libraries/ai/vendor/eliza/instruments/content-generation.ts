import { Instrument } from "../types/instrument";
import { ContentService } from "../services/content-service";

export class ContentGenerationInstrument implements Instrument {
  name = "content-generation";
  description = "Generates book content for each chapter";
  private contentService: ContentService;

  constructor(contentService: ContentService) {
    this.contentService = contentService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Write") || task.includes("Edit")) {
      const prompt = "Write a chapter about Artificial Intelligence";
      const content = await this.contentService.generateContent(prompt);
      console.log(`Generated content: ${content}`);
    }
  }
}