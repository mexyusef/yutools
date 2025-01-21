import * as vscode from 'vscode';
import { runCommand } from "./runCommand";

// Open repository in the browser
export const github_browse = vscode.commands.registerCommand('yutools.github.browse', async (repoName?: string) => {
  try {
    const command = repoName ? `gh browse --repo ${repoName}` : 'gh browse';
    const output = await runCommand(command);
    vscode.window.showInformationMessage(output || 'Opened repository in the browser.');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open repository: ${error}`);
  }
});
