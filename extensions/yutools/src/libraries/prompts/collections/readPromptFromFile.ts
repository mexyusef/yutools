import * as vscode from 'vscode';
import * as fs from 'fs';

export async function readPromptFromFile(filePath: string): Promise<string> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent;
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error reading prompt file: ${error.message}`);
    throw error;
  }
}