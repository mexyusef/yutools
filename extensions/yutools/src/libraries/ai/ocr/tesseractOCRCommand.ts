import * as vscode from 'vscode';
import { ocrByTesseract } from './tesseract';
import { EditorInserter } from '@/libraries/client/editors/editor_inserter';

export const tesseractCommand = vscode.commands.registerCommand('yutools.ocr.ocrTesseract', async () => {
  const imagePath = await vscode.window.showInputBox({ prompt: 'Enter the path to the image file' });
  if (imagePath) {
    try {
      const result = await ocrByTesseract(imagePath);
      // vscode.window.showInformationMessage('OCR Result (Tesseract):');
      // vscode.window.showTextDocument(await vscode.workspace.openTextDocument({ content: result }));
      EditorInserter.insertTextInNewEditor(result);
    } catch (error) {
      vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});