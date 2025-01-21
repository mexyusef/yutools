import * as vscode from 'vscode';
import { analyzeImage } from './analyzeImage';
import { prompt_image_simple } from '../gemini/multimodal/prompt_image';

export const analyzeImageUrlCommand = vscode.commands.registerCommand('yutools.multimodal.groqVision.analyzeImageUrl', async () => {
  // const outputChannel = vscode.window.createOutputChannel("Groq Vision");

  // Step 1: Ask the user to enter an image URL
  const imageUrl = await vscode.window.showInputBox({
    placeHolder: "https://example.com/image.png",
    prompt: "Enter the URL of the image to analyze",
  });

  if (!imageUrl) {
    vscode.window.showErrorMessage("No image URL provided.");
    return;
  }

  // Step 2: Analyze the image
  try {
    const prompt = await vscode.window.showInputBox({
      placeHolder: prompt_image_simple,
      prompt: "Enter a prompt for image analysis (or press Enter to use the default)",
      value: prompt_image_simple,
    });

    const finalPrompt = prompt || prompt_image_simple;

    await analyzeImage(
      { type: 'url', data: imageUrl }, // Use the URL as the image source
      finalPrompt,
      // false,
      // outputChannel
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message);
  }
});
