import * as vscode from 'vscode';
import { QuickSnipManager } from '../zendb/QuickSnip';

export function register_db_sqlite_quicksnip_commands(context: vscode.ExtensionContext) {
  // Initialize the QuickSnipManager with the global storage path
  const dbPath = context.globalStorageUri.fsPath + '/quicksnips.sqlite';
  const quickSnipManager = new QuickSnipManager(dbPath);

  // Register the "Save Snippet" command
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.db.quicksnip.save', () => {
      quickSnipManager.saveSnippet();
    })
  );

  // Register the "List Snippets" command
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.db.quicksnip.list', () => {
      quickSnipManager.listSnippets();
    })
  );

  // Register the "Search Snippets" command
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.db.quicksnip.search', async () => {
      const query = await vscode.window.showInputBox({ prompt: 'Enter a keyword or tag to search' });
      if (query) {
        quickSnipManager.searchSnippets(query);
      }
    })
  );

  // Register the "Delete Snippet" command
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.db.quicksnip.delete', async () => {
      const snippets = quickSnipManager.listSnippetsForDeletion();
      if (snippets.length > 0) {
        const selected = await vscode.window.showQuickPick(snippets, {
          placeHolder: 'Select a snippet to delete',
        });
        if (selected) {
          quickSnipManager.deleteSnippet(selected.id);
          vscode.window.showInformationMessage('Snippet deleted successfully!');
        }
      } else {
        vscode.window.showInformationMessage('No snippets found.');
      }
    })
  );

  // Clean up when the extension is deactivated
  context.subscriptions.push(
    new vscode.Disposable(() => {
      quickSnipManager.close();
    })
  );
}
