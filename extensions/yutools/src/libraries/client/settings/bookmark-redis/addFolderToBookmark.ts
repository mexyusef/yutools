import * as vscode from 'vscode';
import { folderBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';
import { updateBookmarks } from './updateBookmarks';

export const addFolderToBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.bookmarks.redis.addFolderToBookmark', async () => {
  const bookmarks = await getBookmarks(folderBookmarkKey);
  const uris = await vscode.window.showOpenDialog({
    canSelectMany: true,
    openLabel: 'Add Folders to Bookmark',
    canSelectFiles: false,
    canSelectFolders: true,
  });

  if (uris) {
    const newFolders = uris.filter((uri) => !bookmarks.some((bookmark) => bookmark.fsPath === uri.fsPath));
    if (newFolders.length > 0) {
      const updatedBookmarks = [...bookmarks, ...newFolders];
      await updateBookmarks(folderBookmarkKey, updatedBookmarks);
      vscode.window.showInformationMessage(`${newFolders.length} folder(s) added to bookmark.`);
    } else {
      vscode.window.showInformationMessage('No new folders to add to bookmark.');
    }
  }
});
