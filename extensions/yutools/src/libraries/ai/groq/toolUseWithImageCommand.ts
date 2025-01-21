import * as vscode from 'vscode';
import { GroqVisionClient } from './GroqVisionClient';

export const toolUseWithImageCommand = vscode.commands.registerCommand('groqVision.toolUseWithImage', async () => {
  const outputChannel = vscode.window.createOutputChannel("Groq Vision");
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

    // Step 3: Define the tool
    const toolDefinition = {
      type: "function" as const,
      function: {
        name: "get_dog_facts",
        description: "Gets facts about a given dog breed",
        parameters: {
          type: "object",
          properties: {
            breed_name: {
              type: "string",
              description: "The name of the dog breed",
            },
          },
          required: ["breed_name"],
        },
      },
    };

    // Step 4: Initialize the GroqVisionClient
    const client = new GroqVisionClient();

    // Step 5: Analyze the image with tool use
    const result = await client.toolUseWithImage({ type: "base64", data: imageData }, toolDefinition);

    // Step 6: Display the result
    outputChannel.clear();
    outputChannel.appendLine("Tool Use Result:");
    outputChannel.appendLine(JSON.stringify(result, null, 2));
    outputChannel.show();
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error analyzing image with tool use: ${error.message}`);
  }
});
