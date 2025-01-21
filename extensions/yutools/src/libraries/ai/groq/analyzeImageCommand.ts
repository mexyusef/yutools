import * as vscode from 'vscode';
import { GroqVisionClient } from './GroqVisionClient';
import { groqSettings } from '../config';
import { prompt_image_simple } from '../gemini/multimodal/prompt_image';
import { EditorInserter } from '@/libraries/client/editors/editor_inserter';

export const analyzeImageCommand = vscode.commands.registerCommand('groqVision.analyzeImage', async () => {
  // const outputChannel = vscode.window.createOutputChannel("Groq Vision");
  try {
    // Step 1: Ask the user to select an image file
    const fileUri = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: { Images: ["png", "jpg", "jpeg"] },
    });

    if (!fileUri || fileUri.length === 0) {
      vscode.window.showErrorMessage("No image file selected.");
      return;
    }

    const imagePath = fileUri[0].fsPath;

    // Step 2: Encode the image to base64
    const fs = require('fs');
    const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });

    // Step 3: Initialize the GroqVisionClient
    // const apiKey = "your-api-key"; // Replace with your actual API key
    const client = new GroqVisionClient();

    // Step 4: Analyze the image
    const prompt = prompt_image_simple;
    // const model = "llama-3.2-11b-vision-preview";
    const model = groqSettings.getConfig().visionModel as string;
    const result = await client.analyzeImage(
      { type: "base64", data: imageData },
      prompt,
      model
    );

    // Step 5: Display the result
    // outputChannel.clear();
    // outputChannel.appendLine("Image Analysis Result:");
    // outputChannel.appendLine(result);
    // outputChannel.show();
    EditorInserter.insertTextInNewEditor(result);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error analyzing image: ${error.message}`);
  }
});
