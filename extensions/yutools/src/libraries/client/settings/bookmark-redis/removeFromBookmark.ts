import * as vscode from 'vscode';
import { fileBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';
import { updateBookmarks } from './updateBookmarks';

export const removeFromBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.bookmarks.redis.removeFromBookmark', async () => {
  const bookmarks = await getBookmarks(fileBookmarkKey);
  if (bookmarks.length === 0) {
    vscode.window.showInformationMessage('No files in bookmark to remove.');
    return;
  }

  const selectedFiles = await vscode.window.showQuickPick(
    bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
    { canPickMany: true, placeHolder: 'Select files to remove from bookmark' }
  );

  if (selectedFiles) {
    const remainingBookmarks = bookmarks.filter((uri) => !selectedFiles.some((file) => file.uri.fsPath === uri.fsPath));
    await updateBookmarks(fileBookmarkKey, remainingBookmarks);
    vscode.window.showInformationMessage(`${selectedFiles.length} file(s) removed from bookmark.`);
  }
});