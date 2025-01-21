import * as vscode from 'vscode';

const searchTextInFiles = vscode.commands.registerCommand('extension.searchTextInFiles', async () => {
  // Prompt user for the text to search
  const searchText = await vscode.window.showInputBox({
    prompt: 'Enter the text to search for',
  });

  if (!searchText) {
    vscode.window.showWarningMessage('No text entered for search.');
    return;
  }

  // Prompt user for the base folder to search in
  const folders = vscode.workspace.workspaceFolders;
  if (!folders) {
    vscode.window.showErrorMessage('No folder is open in the workspace.');
    return;
  }

  const baseFolder = await vscode.window.showQuickPick(
    folders.map((folder) => folder.uri.fsPath),
    { placeHolder: 'Select a folder to search in' }
  );

  if (!baseFolder) {
    vscode.window.showWarningMessage('No folder selected for search.');
    return;
  }

  // Perform the search
  const results: string[] = [];
  const options: vscode.FindTextInFilesOptions = {
    include: new vscode.RelativePattern(baseFolder, '**/*'), // Include all files in the folder
  };

  await vscode.workspace.findTextInFiles(
    { pattern: searchText },
    options,
    (result: vscode.TextSearchResult) => {
      const filePath = result.uri.fsPath;
      // results.push(`Found in ${filePath}: ${result.ranges.map((range: vscode.Range) => range.start.line + 1).join(', ')}`);
      results.push(
        `Found in ${filePath} at line(s): ${result.ranges
            .map((range: vscode.Range) => range.start.line + 1)
            .join(', ')}`
      );
    }
  );

  // Show results in the output window or a quick pick
  if (results.length > 0) {
    vscode.window.showQuickPick(results, { canPickMany: true, placeHolder: 'Search results' });
  } else {
    vscode.window.showInformationMessage('No matches found.');
  }
});

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(searchTextInFiles);
}
