import * as vscode from 'vscode';
import { ToolRegistry } from '.';
import { GroqVisionClientToolUse } from './tool-use-groq';


export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Groq Vision Tool Use");

  // Initialize the tool registry
  const toolRegistry = new ToolRegistry();
  toolRegistry.registerTool({
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
    handler: async (args: { breed_name: string }) => {
      const apiUrl = `https://api.api-ninjas.com/v1/dogs?name=${args.breed_name}`;
      const response = await fetch(apiUrl, {
        headers: { "X-Api-Key": "your-api-ninjas-key" },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch dog facts: ${response.statusText}`);
      }
      const data = await response.json();
      return data[0];
    },
  });

  // Initialize the GroqVisionClient
  const apiKey = "your-api-key"; // Replace with your actual API key
  const client = new GroqVisionClientToolUse(apiKey, toolRegistry);

  // Register the command
  const analyzeImageWithToolCommand = vscode.commands.registerCommand('groqVision.analyzeImageWithTool', async () => {
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

      // Step 3: Analyze the image with tool use
      const result = await client.analyzeImageWithTool({ type: "base64", data: imageData }, "Analyze this image and use the tool.");

      // Step 4: Display the result
      outputChannel.clear();
      outputChannel.appendLine("Tool Use Result:");
      outputChannel.appendLine(JSON.stringify(result, null, 2));
      outputChannel.show();
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error analyzing image with tool use: ${error.message}`);
    }
  });

  context.subscriptions.push(analyzeImageWithToolCommand);
}

export function deactivate() {}