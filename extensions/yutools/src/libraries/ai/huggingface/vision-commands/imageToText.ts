import * as vscode from 'vscode';
import { HuggingFaceClient } from '../ImageVision';
import { EditorInserter } from '@/libraries/client/editors/editor_inserter';

export const imageToText = vscode.commands.registerCommand('yutools.llm.huggingface.imageToText', async () => {
  // Get user input for the image path or URL
  // const imageInput = await vscode.window.showInputBox({
  //   placeHolder: 'Enter the image path or URL',
  //   prompt: 'e.g., "https://example.com/image.png" or "/path/to/image.png"',
  // });

  // if (!imageInput) {
  //   vscode.window.showErrorMessage('No image provided.');
  //   return;
  // }
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
  const imageInput = fileUri[0].fsPath;

  const hfClient = new HuggingFaceClient();
  try {
    // Generate the text description
    const description = await hfClient.imageToText(imageInput);
    // // Show the result in a new editor
    // const document = await vscode.workspace.openTextDocument({ content: description });
    // await vscode.window.showTextDocument(document);
    EditorInserter.insertTextInNewEditor(description);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Image to text conversion failed: ${error.message}`);
  }
});