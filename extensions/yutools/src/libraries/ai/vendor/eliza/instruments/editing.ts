import { Instrument } from "../types/instrument";
import { EditingService } from "../services/editing-service";

export class EditingInstrument implements Instrument {
  name = "editing";
  description = "Edits and refines book content";
  private editingService: EditingService;

  constructor(editingService: EditingService) {
    this.editingService = editingService;
  }

  async handler(task: string): Promise<void> {
    if (task.includes("Edit") || task.includes("Ensure")) {
      const content = "Placeholder content to edit";
      const editedContent = await this.editingService.editContent(content);
      console.log(`Edited content: ${editedContent}`);
    }
  }
}