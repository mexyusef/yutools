import * as vscode from 'vscode';
import { GroqVisionClient } from './GroqVisionClient';
import { EditorInserter } from '@/libraries/client/editors/editor_inserter';

export const analyzeImageWithToolCommand = vscode.commands.registerCommand('groqVision.analyzeImageWithTool', async () => {

  // const outputChannel = vscode.window.createOutputChannel("Groq Vision Tool Use");

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
    const client = new GroqVisionClient();

    // Step 4: Analyze the image with tool use
    const result = await client.analyzeImageWithTool({ type: "base64", data: imageData });

    // Step 5: Display the result
    // outputChannel.clear();
    // outputChannel.appendLine("Tool Use Result:");
    // outputChannel.appendLine(JSON.stringify(result, null, 2));
    // outputChannel.show();
    EditorInserter.insertTextInNewEditor(result);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error analyzing image with tool use: ${error.message}`);
  }

});
