import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { HuggingFaceClient } from '../ImageVision';

export const transformImage = vscode.commands.registerCommand('yutools.llm.huggingface.transformImage', async () => {
  // Get user input for the image path or URL
  const imageInput = await vscode.window.showInputBox({
    placeHolder: 'Enter the image path or URL',
    prompt: 'e.g., "https://example.com/image.png" or "/path/to/image.png"',
  });

  if (!imageInput) {
    vscode.window.showErrorMessage('No image provided.');
    return;
  }

  // Get user input for the transformation prompt
  const prompt = await vscode.window.showInputBox({
    placeHolder: 'Enter a prompt for image transformation',
    prompt: 'e.g., "make the image look like a painting"',
  });

  if (!prompt) {
    vscode.window.showErrorMessage('No prompt provided.');
    return;
  }

  // Initialize the HuggingFaceClient
  const hfClient = new HuggingFaceClient();

  try {
    // Transform the image
    const transformedImageBlob = await hfClient.transformImage(imageInput, prompt);

    // Convert Blob to Buffer
    const imageBuffer = await transformedImageBlob.arrayBuffer();

    // Get the workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No workspace folder is open.');
      return;
    }

    // Save the transformed image to the workspace
    const outputDir = path.join(workspaceFolders[0].uri.fsPath, 'transformed_images');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const imagePath = path.join(outputDir, `transformed_image_${Date.now()}.png`);
    fs.writeFileSync(imagePath, Buffer.from(imageBuffer));

    // Open the transformed image in VS Code
    const imageUri = vscode.Uri.file(imagePath);
    await vscode.commands.executeCommand('vscode.open', imageUri);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Image transformation failed: ${error.message}`);
  }
});