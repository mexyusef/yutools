import * as vscode from 'vscode';
import * as fs from 'fs';
import { handleGLHFPrompt } from './handleGLHFPrompt';

export const sendPromptWithFilePrefix = vscode.commands.registerCommand('yutools.llm.glhf.sendPromptWithFilePrefix', async () => {
  const filePath = vscode.workspace.getConfiguration('yutools').get<string>('fmusLLMPrompt');
  if (!filePath) {
    vscode.window.showErrorMessage("No file path configured for 'yutools.fmusLLMPrompt'.");
    return;
  }
  try {
    const prefix = fs.readFileSync(filePath, 'utf8');
    await handleGLHFPrompt(prefix, '');
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error reading file: ${error.message}`);
  }
});
