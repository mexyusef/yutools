// src/tools/fileCopyTool.ts

import { BaseTool } from "./baseTool";
import { Storage } from "@google-cloud/storage";

export class FileCopyTool extends BaseTool {
  private storage: Storage;
  private bucketName: string;

  constructor(bucketName: string) {
    super();
    this.storage = new Storage();
    this.bucketName = bucketName;
  }

  /**
   * Copy a file in Google Cloud Storage.
   *
   * @param args - The arguments containing the source and destination file paths.
   * @returns The file copy result.
   */
  public async execute(args: { sourcePath: string; destinationPath: string }): Promise<any> {
    try {
      console.log(`Copying file: ${args.sourcePath} -> ${args.destinationPath}`);
      const file = this.storage.bucket(this.bucketName).file(args.sourcePath);
      await file.copy(`${this.bucketName}/${args.destinationPath}`);
      return {
        message: "File copied successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }
}