import * as vscode from 'vscode';
import { folderBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';

export const openVSCodeInBookmarkedFolder = vscode.commands.registerCommand('yutools.bookmarks.redis.openVSCodeInBookmarkedFolder',
  async () => {
    // Retrieve the list of bookmarked folders
    const bookmarks = await getBookmarks(folderBookmarkKey);
    if (bookmarks.length === 0) {
      vscode.window.showInformationMessage('No folders in bookmark.');
      return;
    }

    // Show a quick pick menu to select a folder
    const selectedFolder = await vscode.window.showQuickPick(
      bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
      { placeHolder: 'Select a folder to open in VSCode' }
    );

    // If a folder is selected, open it in a new VSCode window
    if (selectedFolder) {
      const folderUri = selectedFolder.uri;

      // Use VSCode's built-in command to open the folder in a new window
      vscode.commands.executeCommand('vscode.openFolder', folderUri, { forceNewWindow: true });
    }
  }
);