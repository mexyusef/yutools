// src/tools/fileRenameTool.ts

import { BaseTool } from "./baseTool";
import { Storage } from "@google-cloud/storage";

export class FileRenameTool extends BaseTool {
  private storage: Storage;
  private bucketName: string;

  constructor(bucketName: string) {
    super();
    this.storage = new Storage();
    this.bucketName = bucketName;
  }

  /**
   * Rename a file in Google Cloud Storage.
   *
   * @param args - The arguments containing the old and new file paths.
   * @returns The file rename result.
   */
  public async execute(args: { oldPath: string; newPath: string }): Promise<any> {
    try {
      console.log(`Renaming file: ${args.oldPath} -> ${args.newPath}`);
      const file = this.storage.bucket(this.bucketName).file(args.oldPath);
      await file.move(args.newPath);
      return {
        message: "File renamed successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to rename file: ${error.message}`);
    }
  }
}