import * as vscode from 'vscode';
import { folderBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';
import { updateBookmarks } from './updateBookmarks';

export const removeFolderFromBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.bookmarks.redis.removeFolderFromBookmark', async () => {
  const bookmarks = await getBookmarks(folderBookmarkKey);

  if (bookmarks.length === 0) {
    vscode.window.showInformationMessage('No folders in bookmark.');
    return;
  }

  const selectedFolders = await vscode.window.showQuickPick(
    bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
    { canPickMany: true, placeHolder: 'Select folders to remove from bookmark' }
  );

  if (selectedFolders) {
    const updatedBookmarks = bookmarks.filter(
      (bookmark) => !selectedFolders.some((selected) => selected.uri.fsPath === bookmark.fsPath)
    );
    await updateBookmarks(folderBookmarkKey, updatedBookmarks);

    vscode.window.showInformationMessage(`${selectedFolders.length} folder(s) removed from bookmark.`);
  } else {
    vscode.window.showInformationMessage('No folders selected for removal.');
  }
});
