import * as vscode from 'vscode';
import { fileBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';
import { updateBookmarks } from './updateBookmarks';

export const addToBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.bookmarks.redis.addToBookmark', async () => {
  let filesToAdd: vscode.Uri[] = [];
  const bookmarks = await getBookmarks(fileBookmarkKey);

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor && activeEditor.document.uri.scheme === 'file') {
    filesToAdd.push(activeEditor.document.uri);
  } else {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: true,
      openLabel: 'Add to Bookmark',
    });
    if (uris) {
      filesToAdd = uris;
    }
  }

  const newFiles = filesToAdd.filter((uri) => !bookmarks.some((bookmark) => bookmark.fsPath === uri.fsPath));
  if (newFiles.length > 0) {
    const updatedBookmarks = [...bookmarks, ...newFiles];
    await updateBookmarks(fileBookmarkKey, updatedBookmarks);
    vscode.window.showInformationMessage(`${newFiles.length} file(s) added to bookmark.`);
  } else {
    vscode.window.showInformationMessage('No new files to add to bookmark.');
  }
});
