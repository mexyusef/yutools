import { BaseTool } from "./baseTool";
import fs from "fs";
import path from "path";

export class FileMetadataSearchTool extends BaseTool {
  /**
   * Search for files in a directory based on metadata.
   *
   * @param args - The arguments containing the directory path and metadata criteria.
   * @returns The list of matching files.
   */
  public async execute(args: { directory: string; criteria: { minSize?: number; maxSize?: number; createdAfter?: Date } }): Promise<any> {
    try {
      console.log(`Searching for files in directory: ${args.directory} with criteria: ${JSON.stringify(args.criteria)}`);

      const files = await fs.promises.readdir(args.directory);
      const matchingFiles: string[] = [];

      for (const file of files) {
        const filePath = path.join(args.directory, file);
        const stats = await fs.promises.stat(filePath);

        if (
          (!args.criteria.minSize || stats.size >= args.criteria.minSize) &&
          (!args.criteria.maxSize || stats.size <= args.criteria.maxSize) &&
          (!args.criteria.createdAfter || stats.birthtime >= args.criteria.createdAfter)
        ) {
          matchingFiles.push(file);
        }
      }

      return {
        files: matchingFiles,
        message: "File metadata search completed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to search for files: ${error.message}`);
    }
  }
}