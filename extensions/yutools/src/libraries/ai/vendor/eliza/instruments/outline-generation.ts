import { Instrument } from "../types/instrument";
import { OutlineService } from "../services/outline-service";

export class OutlineGenerationInstrument implements Instrument {
  name = "outline-generation";
  description = "Generates a book outline";
  private outlineService: OutlineService;

  constructor(outlineService: OutlineService) {
    this.outlineService = outlineService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Generate") || task.includes("Organize")) {
      const topic = "Artificial Intelligence"; // Replace with dynamic topic
      const outline = await this.outlineService.generateOutline(topic);
      console.log(`Generated outline: ${outline}`);
    }
  }
}