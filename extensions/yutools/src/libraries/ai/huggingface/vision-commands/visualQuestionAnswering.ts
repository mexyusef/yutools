import * as vscode from 'vscode';
import { HuggingFaceClient } from '../ImageVision';

export const visualQuestionAnswering = vscode.commands.registerCommand('yutools.llm.huggingface.visualQuestionAnswering', async () => {
  // Get user input for the image path or URL
  const imageInput = await vscode.window.showInputBox({
    placeHolder: 'Enter the image path or URL',
    prompt: 'e.g., "https://example.com/image.png" or "/path/to/image.png"',
  });

  if (!imageInput) {
    vscode.window.showErrorMessage('No image provided.');
    return;
  }

  // Get user input for the question
  const question = await vscode.window.showInputBox({
    placeHolder: 'Enter a question about the image',
    prompt: 'e.g., "What is the main object in the image?"',
  });

  if (!question) {
    vscode.window.showErrorMessage('No question provided.');
    return;
  }

  // Initialize the HuggingFaceClient
  const hfClient = new HuggingFaceClient();

  try {
    // Answer the question about the image
    const answer = await hfClient.visualQuestionAnswering(imageInput, question);

    // Show the result in a new editor
    const document = await vscode.workspace.openTextDocument({ content: answer });
    await vscode.window.showTextDocument(document);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Visual question answering failed: ${error.message}`);
  }
});