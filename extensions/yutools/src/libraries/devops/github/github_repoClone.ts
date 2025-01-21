import * as vscode from 'vscode';
import { runCommand } from "./runCommand";

// Clone a repository
export const github_repoClone = vscode.commands.registerCommand('yutools.github.repoClone', async () => {
  const url = await vscode.window.showInputBox({ prompt: 'Enter repository URL or owner/repo' });
  if (!url) return;

  try {
    const output = await runCommand(`gh repo clone ${url}`);
    vscode.window.showInformationMessage(output || `Repository cloned successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to clone repository: ${error}`);
  }
});
