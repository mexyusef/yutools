import * as vscode from 'vscode';
import { runCommand } from "./runCommand";

// Create a repository with options
export const github_repoCreate = vscode.commands.registerCommand('yutools.github.repoCreate', async () => {
  const name = await vscode.window.showInputBox({ prompt: 'Enter repository name' });
  if (!name) return;

  const description = await vscode.window.showInputBox({ prompt: 'Enter repository description (optional)' });
  const visibility = await vscode.window.showQuickPick(['public', 'private'], { placeHolder: 'Select repository visibility' });
  if (!visibility) return;

  try {
    const command = `gh repo create ${name} --${visibility} --description "${description || ''}"`;
    const output = await runCommand(command);
    vscode.window.showInformationMessage(output || `Repository ${name} created successfully.`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to create repository: ${error}`);
  }
});
