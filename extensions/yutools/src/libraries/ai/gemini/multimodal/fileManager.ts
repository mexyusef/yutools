import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";

export class FileManager {
  private fileManager: GoogleAIFileManager;

  constructor(apiKey: string) {
    this.fileManager = new GoogleAIFileManager(apiKey);
  }

  async uploadFile(filePath: string, mimeType: string): Promise<any> {
    return await this.fileManager.uploadFile(filePath, { mimeType });
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.fileManager.deleteFile(fileName);
  }

  async getFile(fileName: string): Promise<any> {
    return await this.fileManager.getFile(fileName);
  }
}