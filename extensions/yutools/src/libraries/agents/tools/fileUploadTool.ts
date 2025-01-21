// src/tools/fileUploadTool.ts

import { BaseTool } from "./baseTool";
import { Storage } from "@google-cloud/storage";

export class FileUploadTool extends BaseTool {
  private storage: Storage;
  private bucketName: string;

  constructor(bucketName: string) {
    super();
    this.storage = new Storage();
    this.bucketName = bucketName;
  }

  /**
   * Upload a file to Google Cloud Storage.
   *
   * @param args - The arguments containing the file data and destination path.
   * @returns The file upload result.
   */
  public async execute(args: { file: Buffer; destination: string }): Promise<any> {
    try {
      console.log(`Uploading file to: ${args.destination}`);
      const file = this.storage.bucket(this.bucketName).file(args.destination);
      await file.save(args.file);
      return {
        url: `https://storage.googleapis.com/${this.bucketName}/${args.destination}`,
        message: "File uploaded successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}