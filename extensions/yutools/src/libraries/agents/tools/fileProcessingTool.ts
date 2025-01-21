// src/tools/fileProcessingTool.ts

import { BaseTool } from "./baseTool";
import fs from "fs";
import path from "path";

export class FileProcessingTool extends BaseTool {
  /**
   * Process a file (e.g., read, write).
   *
   * @param args - The arguments containing the file path and processing options.
   * @returns The file processing result.
   */
  public async execute(args: { filePath: string; operation: string; data?: string }): Promise<any> {
    try {
      console.log(`Processing file: ${args.filePath}`);
      const fullPath = path.resolve(args.filePath);

      switch (args.operation) {
        case "read":
          const content = await fs.promises.readFile(fullPath, "utf-8");
          return {
            content: content,
            message: "File read successfully.",
          };
        case "write":
          if (!args.data) {
            throw new Error("Data is required for write operation.");
          }
          await fs.promises.writeFile(fullPath, args.data, "utf-8");
          return {
            message: "File written successfully.",
          };
        default:
          throw new Error(`Unsupported operation: ${args.operation}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }
}