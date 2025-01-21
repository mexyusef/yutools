import * as vscode from 'vscode';
import { fileBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';
import { updateBookmarks } from './updateBookmarks';

export const viewBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.bookmarks.redis.viewBookmark', async () => {
  const bookmarks = await getBookmarks(fileBookmarkKey);
  if (bookmarks.length === 0) {
    vscode.window.showInformationMessage('No files in bookmark.');
    return;
  }

  const selectedFiles = await vscode.window.showQuickPick(
    bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
    { canPickMany: true, placeHolder: 'Select files to open from bookmark' }
  );

  if (selectedFiles) {
    for (const item of selectedFiles) {
      try {
        const documentUri = vscode.Uri.file(item.uri.fsPath);
        console.log(`Opening bookmark: ${JSON.stringify(documentUri, null, 2)}`);

        const document = await vscode.workspace.openTextDocument(documentUri);
        await vscode.window.showTextDocument(document, { preview: false });
      } catch (error: any) {
        console.error(`Error opening file: ${item.label}. Error: ${error.message}`);
        vscode.window.showErrorMessage(`Failed to open file: ${item.label}`);
      }
    }
  }
});