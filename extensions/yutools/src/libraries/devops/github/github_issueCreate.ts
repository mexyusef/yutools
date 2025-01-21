import * as vscode from 'vscode';
import { runCommand } from "./runCommand";

// Create an issue
export const github_issueCreate = vscode.commands.registerCommand('yutools.github.issueCreate', async () => {
  const title = await vscode.window.showInputBox({ prompt: 'Enter issue title' });
  if (!title) return;

  const body = await vscode.window.showInputBox({ prompt: 'Enter issue body (optional)' });

  try {
    const output = await runCommand(`gh issue create --title "${title}" --body "${body || ''}"`);
    vscode.window.showInformationMessage(output || `Issue "${title}" created successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create issue: ${error}`);
  }
});
