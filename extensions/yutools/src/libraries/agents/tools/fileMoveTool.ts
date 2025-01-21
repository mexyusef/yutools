// src/tools/fileMoveTool.ts

import { BaseTool } from "./baseTool";
import { Storage } from "@google-cloud/storage";

export class FileMoveTool extends BaseTool {
  private storage: Storage;
  private bucketName: string;

  constructor(bucketName: string) {
    super();
    this.storage = new Storage();
    this.bucketName = bucketName;
  }

  /**
   * Move a file in Google Cloud Storage.
   *
   * @param args - The arguments containing the source and destination file paths.
   * @returns The file move result.
   */
  public async execute(args: { sourcePath: string; destinationPath: string }): Promise<any> {
    try {
      console.log(`Moving file: ${args.sourcePath} -> ${args.destinationPath}`);
      const file = this.storage.bucket(this.bucketName).file(args.sourcePath);
      await file.move(args.destinationPath);
      return {
        message: "File moved successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }
}