// src/tools/dataImportTool.ts

import { BaseTool } from "./baseTool";
import fs from "fs";
import csv from "csv-parser";

export class DataImportTool extends BaseTool {
  /**
   * Import data from a file (e.g., CSV, JSON).
   *
   * @param args - The arguments containing the file path and import options.
   * @returns The imported data.
   */
  public async execute(args: { filePath: string; format: string }): Promise<any> {
    try {
      console.log(`Importing data from: ${args.filePath}`);
      let data: any[] = [];

      switch (args.format) {
        case "csv":
          data = await this.importCsv(args.filePath);
          break;
        case "json":
          data = await this.importJson(args.filePath);
          break;
        default:
          throw new Error(`Unsupported format: ${args.format}`);
      }

      return {
        data: data,
        message: "Data imported successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to import data: ${error.message}`);
    }
  }

  private async importCsv(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => results.push(row))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
  }

  private async importJson(filePath: string): Promise<any[]> {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  }
}