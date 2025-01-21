import * as vscode from 'vscode';
import { fileBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';
import { updateBookmarks } from './updateBookmarks';

export const addFileToBookmarkUsingDialog = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.bookmarks.redis.addFileToBookmarkUsingDialog', async () => {
  const bookmarks = await getBookmarks(fileBookmarkKey);

  const uris = await vscode.window.showOpenDialog({
    canSelectMany: true,
    openLabel: 'Add Files to Bookmark',
    canSelectFiles: true,
    canSelectFolders: false,
  });

  if (uris) {
    const newFiles = uris.filter((uri) => !bookmarks.some((bookmark) => bookmark.fsPath === uri.fsPath));
    if (newFiles.length > 0) {
      const updatedBookmarks = [...bookmarks, ...newFiles];
      await updateBookmarks(fileBookmarkKey, updatedBookmarks);
      vscode.window.showInformationMessage(`${newFiles.length} file(s) added to bookmark.`);
    } else {
      vscode.window.showInformationMessage('No new files to add to bookmark.');
    }
  }
});