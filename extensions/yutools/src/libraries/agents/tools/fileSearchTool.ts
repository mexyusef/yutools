import { BaseTool } from "./baseTool";
import fs from "fs";
import path from "path";

export class FileSearchTool extends BaseTool {
  /**
   * Search for files in a directory based on a pattern or criteria.
   *
   * @param args - The arguments containing the directory path and search criteria.
   * @returns The list of matching files.
   */
  public async execute(args: { directory: string; pattern: string }): Promise<any> {
    try {
      console.log(`Searching for files in directory: ${args.directory} with pattern: ${args.pattern}`);

      const files = await fs.promises.readdir(args.directory);
      const matchingFiles = files.filter((file) => file.includes(args.pattern));

      return {
        files: matchingFiles,
        message: "File search completed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to search for files: ${error.message}`);
    }
  }
}