import * as vscode from 'vscode';
import { folderBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';

export const viewFolderBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.bookmarks.redis.viewFolderBookmark', async () => {
  const bookmarks = await getBookmarks(folderBookmarkKey);
  if (bookmarks.length === 0) {
    vscode.window.showInformationMessage('No folders in bookmark.');
    return;
  }

  const selectedFolders = await vscode.window.showQuickPick(
    bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
    { canPickMany: true, placeHolder: 'Select folders to open from bookmark' }
  );

  if (selectedFolders) {
    selectedFolders.forEach(async (item) => {
      vscode.commands.executeCommand('vscode.openFolder', item.uri, true);
    });
  }
});