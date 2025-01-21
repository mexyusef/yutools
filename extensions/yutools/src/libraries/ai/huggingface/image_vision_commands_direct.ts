import * as vscode from 'vscode';
import { HfInference } from '@huggingface/inference';
import * as fs from 'fs';
import * as path from 'path';

// direct use of library @huggingface/inference
export function register_image_vision_direct_commands(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('huggingface.generateImage', async () => {
    // Get user input for the prompt
    const prompt = await vscode.window.showInputBox({
      placeHolder: 'Enter a prompt for image generation',
      prompt: 'e.g., "a picture of a green bird"',
    });

    if (!prompt) {
      vscode.window.showErrorMessage('No prompt provided.');
      return;
    }

    // Initialize Hugging Face Inference client
    const hf = new HfInference('YOUR_HUGGING_FACE_API_KEY');

    try {
      // Generate the image
      const imageBlob = await hf.textToImage({
        model: 'black-forest-labs/FLUX.1-dev',
        inputs: prompt,
      });

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

      // Show success message
      vscode.window.showInformationMessage(`Image saved to: ${imagePath}`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Image generation failed: ${error.message}`);
    }
  });

  context.subscriptions.push(disposable);
}
