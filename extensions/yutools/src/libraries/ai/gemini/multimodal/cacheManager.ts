import { GoogleAICacheManager, GoogleAIFileManager } from "@google/generative-ai/server";
import { GenerativeAI } from "./generativeAI";
import { geminiSettings } from "../../config";

export class CacheManager {
  private cacheManager: GoogleAICacheManager;
  private fileManager: GoogleAIFileManager;

  constructor() {
    this.cacheManager = new GoogleAICacheManager(geminiSettings.getNextProvider().key);
    this.fileManager = new GoogleAIFileManager(geminiSettings.getNextProvider().key);
  }

  async createCache(model: string, filePath: string, mimeType: string) {
    const uploadResult = await this.fileManager.uploadFile(filePath, { mimeType });

    const cacheResult = await this.cacheManager.create({
      model,
      contents: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                fileUri: uploadResult.file.uri,
                mimeType: uploadResult.file.mimeType,
              },
            },
          ],
        },
      ],
    });

    return cacheResult;
  }

  async getCache(cacheName: string) {
    return await this.cacheManager.get(cacheName);
  }

  async deleteCache(cacheName: string) {
    await this.cacheManager.delete(cacheName);
  }

  async listCaches() {
    return await this.cacheManager.list();
  }

  async updateCache(cacheName: string, ttlSeconds: number) {
    return await this.cacheManager.update(cacheName, {
      cachedContent: {
        ttlSeconds,
      },
    });
  }
}