import * as vscode from 'vscode';
import { runCommand } from "./runCommand";


// Authenticate with GitHub
export const github_auth = vscode.commands.registerCommand('yutools.github.auth', async () => {
  try {
    const output = await runCommand('gh auth login');
    vscode.window.showInformationMessage(output || 'Authenticated with GitHub successfully.');
  } catch (error) {
    vscode.window.showErrorMessage(`Authentication failed: ${error}`);
  }
});
