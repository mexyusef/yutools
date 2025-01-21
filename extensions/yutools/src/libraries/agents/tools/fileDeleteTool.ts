// src/tools/fileDeleteTool.ts

import { BaseTool } from "./baseTool";
import { Storage } from "@google-cloud/storage";

export class FileDeleteTool extends BaseTool {
  private storage: Storage;
  private bucketName: string;

  constructor(bucketName: string) {
    super();
    this.storage = new Storage();
    this.bucketName = bucketName;
  }

  /**
   * Delete a file from Google Cloud Storage.
   *
   * @param args - The arguments containing the file path.
   * @returns The file deletion result.
   */
  public async execute(args: { filePath: string }): Promise<any> {
    try {
      console.log(`Deleting file: ${args.filePath}`);
      const file = this.storage.bucket(this.bucketName).file(args.filePath);
      await file.delete();
      return {
        message: "File deleted successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}