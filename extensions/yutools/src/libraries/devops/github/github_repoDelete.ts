import * as vscode from 'vscode';
import { runCommand } from "./runCommand";

// Delete a repository
export const github_repoDelete = vscode.commands.registerCommand('yutools.github.repoDelete', async () => {
  try {
    // Fetch the list of repositories
    const output = await runCommand('gh repo list --json name');
    const repos = JSON.parse(output);

    // Map repositories to QuickPick items
    const items = repos.map((repo: { name: string }) => repo.name);

    // Show the list of repositories to the user
    const selectedRepoName = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a repository to delete',
    });

    if (selectedRepoName) {
      // Ask for confirmation before deleting
      const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: `Are you sure you want to delete the repository "${selectedRepoName}"?`,
      });

      if (confirm === 'Yes') {
        // Delete the repository
        const deleteOutput = await runCommand(`gh repo delete ${selectedRepoName} --confirm`);
        vscode.window.showInformationMessage(deleteOutput || `Repository "${selectedRepoName}" deleted successfully.`);
      } else {
        vscode.window.showInformationMessage('Repository deletion canceled.');
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to delete repository: ${error}`);
  }
});
