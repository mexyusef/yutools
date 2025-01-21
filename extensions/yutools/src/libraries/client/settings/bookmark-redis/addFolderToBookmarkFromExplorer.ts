import * as vscode from 'vscode';
import { folderBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';
import { updateBookmarks } from './updateBookmarks';

export const addFolderToBookmarkFromExplorer = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.bookmarks.redis.addFolderToBookmarkFromExplorer', async (uri: vscode.Uri) => {
  const bookmarks = await getBookmarks(folderBookmarkKey);

  const hasil_fstat = await vscode.workspace.fs.stat(uri);

  if ((hasil_fstat.type & vscode.FileType.Directory) === 0) {
    vscode.window.showErrorMessage('You can only bookmark folders from the context menu.');
    return;
  }

  if (bookmarks.some((bookmark) => bookmark.fsPath === uri.fsPath)) {
    vscode.window.showInformationMessage('This folder is already in your bookmark.');
    return;
  }

  const updatedBookmarks = [...bookmarks, uri];
  await updateBookmarks(folderBookmarkKey, updatedBookmarks);
  vscode.window.showInformationMessage(`Folder "${uri.fsPath}" added to bookmark.`);
});
