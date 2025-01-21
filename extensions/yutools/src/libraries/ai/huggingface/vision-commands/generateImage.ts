import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { HuggingFaceClient } from '../ImageVision';

export const generateImage = vscode.commands.registerCommand('yutools.llm.huggingface.generateImage', async () => {
  // Get user input for the prompt
  const prompt = await vscode.window.showInputBox({
    placeHolder: 'Enter a prompt for image generation',
    prompt: 'e.g., "a picture of a green bird"',
  });

  if (!prompt) {
    vscode.window.showErrorMessage('No prompt provided.');
    return;
  }

  // Initialize the HuggingFaceClient
  const hfClient = new HuggingFaceClient();

  try {
    // Generate the image
    const imageBlob = await hfClient.generateImage(prompt);

    // Convert Blob to Buffer
    const imageBuffer = await imageBlob.arrayBuffer();

    // Get the workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No workspace folder is open.');
      return;
    }

    // Save the image to the workspace
    const outputDir = path.join(workspaceFolders[0].uri.fsPath, 'generated_images');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const imagePath = path.join(outputDir, `generated_image_${Date.now()}.png`);
    fs.writeFileSync(imagePath, Buffer.from(imageBuffer));

    // // Show success message
    // vscode.window.showInformationMessage(`Image saved to: ${imagePath}`);
    // Open the image in VS Code
    const imageUri = vscode.Uri.file(imagePath);
    await vscode.commands.executeCommand('vscode.open', imageUri);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Image generation failed: ${error.message}`);
  }
});