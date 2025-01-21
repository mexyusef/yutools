import * as vscode from 'vscode';
import { folderBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';

export const openTerminalInBookmarkedFolder = vscode.commands.registerCommand('yutools.bookmarks.redis.openTerminalInBookmarkedFolder',
  async () => {
  const bookmarks = await getBookmarks(folderBookmarkKey);
  if (bookmarks.length === 0) {
    vscode.window.showInformationMessage('No folders in bookmark.');
    return;
  }

  const selectedFolder = await vscode.window.showQuickPick(
    bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
    { placeHolder: 'Select a folder to open a terminal' }
  );

  if (selectedFolder) {
    const terminal = vscode.window.createTerminal({
      name: selectedFolder.uri.fsPath,
      cwd: selectedFolder.uri.fsPath,
    });
    terminal.show();
  }
});