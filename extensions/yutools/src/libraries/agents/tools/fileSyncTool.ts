// src/tools/fileSyncTool.ts

import { BaseTool } from "./baseTool";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

export class FileSyncTool extends BaseTool {
  private storage: Storage;
  private bucketName: string;

  constructor(bucketName: string) {
    super();
    this.storage = new Storage();
    this.bucketName = bucketName;
  }

  /**
   * Sync a file between local and remote storage.
   *
   * @param args - The arguments containing the local and remote file paths.
   * @returns The file sync result.
   */
  public async execute(args: { localPath: string; remotePath: string }): Promise<any> {
    try {
      console.log(`Syncing file: ${args.localPath} -> ${args.remotePath}`);

      // Upload local file to remote storage
      const file = this.storage.bucket(this.bucketName).file(args.remotePath);
      const fileBuffer = await fs.promises.readFile(args.localPath);
      await file.save(fileBuffer);

      return {
        message: "File synced successfully.",
      };
    } catch (error: any) {
      throw new Error(`Failed to sync file: ${error.message}`);
    }
  }
}