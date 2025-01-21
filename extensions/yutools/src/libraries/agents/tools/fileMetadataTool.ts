// src/tools/fileMetadataTool.ts

import { BaseTool } from "./baseTool";
import fs from "fs";
import path from "path";

export class FileMetadataTool extends BaseTool {
  /**
   * Retrieve metadata for a file.
   *
   * @param args - The arguments containing the file path.
   * @returns The file metadata.
   */
  public async execute(args: { filePath: string }): Promise<any> {
    try {
      console.log(`Retrieving metadata for file: ${args.filePath}`);
      const stats = await fs.promises.stat(args.filePath);
      return {
        metadata: {
          size: stats.size,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory(),
        },
        message: "File metadata retrieved successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to retrieve file metadata: ${error.message}`);
    }
  }
}