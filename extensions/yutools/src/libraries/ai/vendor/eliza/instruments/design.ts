import { Instrument } from "../types";
import { DesignService } from "../services";

export class DesignInstrument implements Instrument {

  name = "design";
  description = "Creates UI/UX designs and assets for software development tasks";
  private designService: DesignService;

  constructor(designService: DesignService) {
    this.designService = designService;
  }

  async handler(task: string): Promise<void> {
    const design = await this.designService.createDesign(task);
    console.log(`Generated design for: ${task}`);
    console.log(design);
  }

}