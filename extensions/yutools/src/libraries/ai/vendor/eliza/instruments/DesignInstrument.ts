import { Instrument } from "../types/instrument";
import { DesignService } from "../services/design-service";

export class DesignInstrument implements Instrument {
  name = "design";
  // description = "Creates UI/UX designs and assets for software development tasks";
  description = "Designs the book cover and layout";
  private designService: DesignService;

  constructor(designService: DesignService) {
    this.designService = designService;
  }

  async handlerSoftware(task: string): Promise<void> {
    const design = await this.designService.createDesign(task);
    console.log(`Generated design for: ${task}`);
    console.log(design);
  }

  async handlerBook(task: string): Promise<void> {
    if (task.includes("Design") || task.includes("Format")) {
      const prompt = "Design a book cover for a book about AI";
      const designUrl = await this.designService.createDesign(prompt);
      console.log(`Generated design: ${designUrl}`);
    }
  }

  async handler(task: string): Promise<void> {
    this.handlerSoftware(task);
  }

}