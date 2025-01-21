import vscode from "vscode";
import fs from "fs";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { geminiSettings } from "../../config";
import { generateGenerativePartFromClipboard, generateGenerativePartFromFileSafe } from "./clipboard_utils";

export class GeminiMultimodal {

  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    this.genAI = new GoogleGenerativeAI(geminiSettings.getNextProvider().key);
    this.model = this.genAI.getGenerativeModel(
      {
        model: geminiSettings.getConfig().visionModel as string
      }
    );
  }

  /**
   * Generate text based on an image and a text prompt.
   * @param prompt - The text prompt to describe the context.
   * @param imagePath - The path to the image file.
   * @param mimeType - The MIME type of the image (e.g., "image/jpeg").
   * @returns The generated text response.
   */
  async generateFromImage(prompt: string, imagePath: string, mimeType: string): Promise<string> {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    const imagePart = await generateGenerativePartFromFileSafe(imagePath, mimeType);
    const result = await this.model.generateContent([prompt, imagePart]);

    if (result && result.response && result.response.text) {
      return result.response.text();
    } else {
      throw new Error("Failed to generate text response.");
    }
  }

  /**
   * Generate text based on a clipboard image and a text prompt.
   * @param prompt - The text prompt to describe the context.
   * @param mimeType - The MIME type of the clipboard image (e.g., "image/png").
   * @returns The generated text response.
   */
  async generateFromClipboard(prompt: string, mimeType: string): Promise<string> {
    const imagePart = await generateGenerativePartFromClipboard(mimeType);
    const result = await this.model.generateContent([prompt, imagePart]);

    if (result && result.response && result.response.text) {
      return result.response.text();
    } else {
      throw new Error("Failed to generate text response.");
    }
  }

  /**
   * Generate text based on an image selected via VS Code file dialog and a text prompt.
   * @param prompt - The text prompt to describe the context.
   * @param mimeType - The MIME type of the selected image (e.g., "image/jpeg").
   * @returns The generated text response.
   */
  async generateFromFileDialog(): Promise<string> {
    const fileUri = await vscode.window.showOpenDialog({
      canSelectMany: false,
      openLabel: "Select an image",
      filters: { Images: ["jpg", "jpeg", "png"] },
    });
    if (!fileUri || fileUri.length === 0) {
      throw new Error("No file selected.");
    }
    const imagePath = fileUri[0].fsPath;
    // stlh pilih file baru minta prompt
    const default_prompt = "What does this image depict?";
    const prompt = await vscode.window.showInputBox(
      { prompt: "Enter your prompt for the image (Press Enter to use default)", value: default_prompt, }
    ) || default_prompt;
    const mimeType = "image/jpeg";
    return await this.generateFromImage(prompt, imagePath, mimeType);
  }

}
