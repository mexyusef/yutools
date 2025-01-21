import * as vscode from 'vscode';
import { runCommand } from "./runCommand";

// Manage pull requests
export const github_prCreate = vscode.commands.registerCommand('yutools.github.prCreate', async () => {
  const title = await vscode.window.showInputBox({ prompt: 'Enter PR title' });
  if (!title) return;

  const body = await vscode.window.showInputBox({ prompt: 'Enter PR body (optional)' });

  try {
    const output = await runCommand(`gh pr create --title "${title}" --body "${body || ''}"`);
    vscode.window.showInformationMessage(output || `Pull request "${title}" created successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create pull request: ${error}`);
  }
});
