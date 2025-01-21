import * as vscode from 'vscode';
import { runCommand } from "./runCommand";
import { RepoQuickPickItem } from './RepoQuickPickItem';

export const github_repoList = vscode.commands.registerCommand('yutools.github.repoList', async () => {
  try {
    // Fetch the list of repositories with owner and name
    const output = await runCommand('gh repo list --json name,owner');
    const repos = JSON.parse(output);

    // Map repositories to QuickPick items
    const items: RepoQuickPickItem[] = repos.map((repo: { name: string; owner: { login: string } }) => ({
      label: repo.name, // Display name
      description: `Owner: ${repo.owner.login}`, // Additional info
      fullName: `${repo.owner.login}/${repo.name}`, // Full repository identifier
    }));

    // Show the list of repositories to the user
    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a repository to open in the browser',
    });

    if (selected) {
      // Pass the full repository identifier (owner/repo) to the browse command
      vscode.commands.executeCommand('yutools.github.browse', selected.fullName);
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to list repositories: ${error}`);
  }
});
