import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { geminiSettings } from "../../config";

export class GeminiAI {
  private apiKey: string;
  private model: any;

  constructor() {
    this.apiKey = geminiSettings.getNextProvider().key;
    this.model = new GoogleGenerativeAI(this.apiKey).getGenerativeModel({
      model: geminiSettings.getConfig().model,
    });
  }

  /**
   * Generate text from a given prompt.
   * @param prompt - Input prompt for the LLM.
   * @returns A Promise resolving to the generated text.
   */
  async generateText(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Generate text from a given prompt and stream the response.
   * @param prompt - Input prompt for the LLM.
   * @param onChunk - Callback to handle streamed chunks of text.
   * @returns A Promise that resolves when streaming is complete.
   */
  async generateTextStream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    const result = await this.model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      onChunk(chunk.text());
    }
  }

  /**
   * Generate multimodal content.
   * @param prompt - Input prompt for the LLM.
   * @param files - Array of file objects containing data and mimeType.
   * @returns A Promise resolving to the generated text.
   */
  async generateMultimodal(prompt: string, files: { data: Buffer; mimeType: string }[]): Promise<string> {
    const input = [
      prompt,
      ...files.map((file) => ({
        inlineData: {
          data: file.data.toString("base64"),
          mimeType: file.mimeType,
        },
      })),
    ];

    const result = await this.model.generateContent(input);
    return result.response.text();
  }

  /**
   * Upload a file to the server.
   * @param filePath - Path to the file.
   * @param mimeType - MIME type of the file.
   * @returns A Promise resolving to the file URI.
   */
  async uploadFile(filePath: string, mimeType: string): Promise<string> {
    const fs = await import("fs");
    const buffer = fs.readFileSync(filePath);
    // const fileManager = new GoogleGenerativeAI(this.apiKey).getFileManager();
    const fileManager = new GoogleAIFileManager(this.apiKey);
    const uploadResult = await fileManager.uploadFile(filePath, { mimeType, displayName: filePath });
    return uploadResult.file.uri;
  }

}
