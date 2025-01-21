// src/tools/fileDownloadTool.ts

import { BaseTool } from "./baseTool";
import { Storage } from "@google-cloud/storage";

export class FileDownloadTool extends BaseTool {
  private storage: Storage;
  private bucketName: string;

  constructor(bucketName: string) {
    super();
    this.storage = new Storage();
    this.bucketName = bucketName;
  }

  /**
   * Download a file from Google Cloud Storage.
   *
   * @param args - The arguments containing the file path.
   * @returns The downloaded file.
   */
  public async execute(args: { filePath: string }): Promise<any> {
    try {
      console.log(`Downloading file: ${args.filePath}`);
      const file = this.storage.bucket(this.bucketName).file(args.filePath);
      const [fileBuffer] = await file.download();
      return {
        file: fileBuffer,
        message: "File downloaded successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }
}