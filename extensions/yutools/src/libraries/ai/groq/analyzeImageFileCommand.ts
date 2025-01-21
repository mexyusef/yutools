import * as vscode from 'vscode';
import { analyzeImage } from './analyzeImage';
import { prompt_image_simple } from '../gemini/multimodal/prompt_image';

export const analyzeImageFileCommand = vscode.commands.registerCommand('yutools.multimodal.groqVision.analyzeImageFile', async () => {
  // const outputChannel = vscode.window.createOutputChannel("Groq Vision");

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

  // Step 2: Analyze the image
  try {
    const prompt = await vscode.window.showInputBox({
      placeHolder: prompt_image_simple,
      prompt: "Enter a prompt for image analysis (or press Enter to use the default)",
      value: prompt_image_simple,
    });

    const finalPrompt = prompt || prompt_image_simple;

    await analyzeImage(
      { type: 'file', data: imagePath },
      finalPrompt,
      // false,
      // outputChannel
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message);
  }
});

