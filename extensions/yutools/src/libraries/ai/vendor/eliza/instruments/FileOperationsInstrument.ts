import { Instrument } from "../types/instrument";
import fs from "fs";
import path from "path";

export class FileOperationsInstrument implements Instrument {
  name = "file-operations";
  description = "Handles file operations like saving and reading files";

  async handler(task: string): Promise<void> {
    if (task.includes("Save") || task.includes("Read")) {
      const filePath = path.join(__dirname, "output.txt");
      fs.writeFileSync(filePath, "Sample content");
      console.log(`File saved to: ${filePath}`);
    }
  }
}