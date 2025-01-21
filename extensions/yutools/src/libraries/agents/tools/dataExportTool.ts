// src/tools/dataExportTool.ts

import { BaseTool } from "./baseTool";
import { Parser } from "json2csv";
import fs from "fs";

export class DataExportTool extends BaseTool {
  /**
   * Export data to a file (e.g., CSV, JSON).
   *
   * @param args - The arguments containing the data and export options.
   * @returns The export result.
   */
  public async execute(args: { data: any[]; format: string; filePath: string }): Promise<any> {
    try {
      console.log(`Exporting data to: ${args.filePath}`);
      let fileContent: string;

      switch (args.format) {
        case "csv":
          const parser = new Parser();
          fileContent = parser.parse(args.data);
          break;
        case "json":
          fileContent = JSON.stringify(args.data, null, 2);
          break;
        default:
          throw new Error(`Unsupported format: ${args.format}`);
      }

      await fs.promises.writeFile(args.filePath, fileContent, "utf-8");
      return {
        message: "Data exported successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to export data: ${error.message}`);
    }
  }
}