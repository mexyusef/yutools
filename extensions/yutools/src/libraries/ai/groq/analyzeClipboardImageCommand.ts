import * as vscode from 'vscode';
import { ClipboardImageHelper } from '@/libraries/clipboard/ClipboardImageHelper';
import { analyzeImage } from './analyzeImage';

export const analyzeClipboardImageCommand = vscode.commands.registerCommand('yutools.multimodal.groqVision.analyzeClipboardImage', async () => {
  // const outputChannel = vscode.window.createOutputChannel("Groq Vision");

  try {
    // Step 1: Get the image from the clipboard
    const base64Image = await ClipboardImageHelper.getImageFromClipboard();

    if (!base64Image) {
      vscode.window.showErrorMessage("No image found in the clipboard.");
      return;
    }

    // Step 2: Analyze the image
    const prompt = await vscode.window.showInputBox({
      placeHolder: "What's in this image?",
      prompt: "Enter a prompt for image analysis (or press Enter to use the default)",
      value: "What's in this image?",
    });

    const finalPrompt = prompt || "What's in this image?";

    await analyzeImage(
      { type: 'clipboard', data: base64Image }, // Use the clipboard image
      finalPrompt,
      // false,
      // outputChannel
    );
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message);
  }
});
