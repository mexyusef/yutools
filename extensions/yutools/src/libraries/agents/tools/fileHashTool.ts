// src/tools/fileHashTool.ts

import { BaseTool } from "./baseTool";
import crypto from "crypto";
import fs from "fs";

export class FileHashTool extends BaseTool {
  /**
   * Generate a hash for a file.
   *
   * @param args - The arguments containing the file path and hash algorithm.
   * @returns The file hash.
   */
  public async execute(args: { filePath: string; algorithm: string }): Promise<any> {
    try {
      console.log(`Generating hash for file: ${args.filePath}`);
      const fileContent = await fs.promises.readFile(args.filePath);
      const hash = crypto.createHash(args.algorithm).update(fileContent).digest("hex");
      return {
        hash: hash,
        message: "File hash generated successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to generate file hash: ${error.message}`);
    }
  }
}