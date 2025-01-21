import * as vscode from 'vscode';
import { HuggingFaceClient } from '../ImageVision';

export const documentQuestionAnswering = vscode.commands.registerCommand('yutools.llm.huggingface.documentQuestionAnswering', async () => {
  // Get user input for the document image path or URL
  const imageInput = await vscode.window.showInputBox({
    placeHolder: 'Enter the document image path or URL',
    prompt: 'e.g., "https://example.com/document.png" or "/path/to/document.png"',
  });

  if (!imageInput) {
    vscode.window.showErrorMessage('No document image provided.');
    return;
  }

  // Get user input for the question
  const question = await vscode.window.showInputBox({
    placeHolder: 'Enter a question about the document',
    prompt: 'e.g., "What is the total amount due?"',
  });

  if (!question) {
    vscode.window.showErrorMessage('No question provided.');
    return;
  }

  // Initialize the HuggingFaceClient
  const hfClient = new HuggingFaceClient();

  try {
    // Answer the question about the document
    const answer = await hfClient.documentQuestionAnswering(imageInput, question);

    // Show the result in a new editor
    const document = await vscode.workspace.openTextDocument({ content: answer });
    await vscode.window.showTextDocument(document);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Document question answering failed: ${error.message}`);
  }
});