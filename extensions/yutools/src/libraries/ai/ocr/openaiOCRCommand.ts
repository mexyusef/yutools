import * as vscode from 'vscode';
import { ocrByOpenAI } from './openai';
import { EditorInserter } from '@/libraries/client/editors/editor_inserter';

// Command for OCR using OpenAI GPT-4 Vision
export const openaiOCRCommand = vscode.commands.registerCommand('yutools.ocr.openaiOCRCommand', async () => {
  const imagePath = await vscode.window.showInputBox({ prompt: 'Enter the path to the image file' });
  const userPrompt = await vscode.window.showInputBox({ prompt: 'Enter the user prompt for OpenAI' });

  if (imagePath && userPrompt) {
    try {
      const result = await ocrByOpenAI(imagePath, userPrompt);
      // vscode.window.showInformationMessage('OCR Result (OpenAI):');
      // vscode.window.showTextDocument(await vscode.workspace.openTextDocument({ content: result }));
      EditorInserter.insertTextInNewEditor(result);
    } catch (error) {
      vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});
