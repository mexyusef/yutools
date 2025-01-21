import * as vscode from 'vscode';

export const selectFilesForBookmark = vscode.commands.registerCommand('yutools.bookmarks.redis.selectFilesForBookmark', async () => {
  const uris = await vscode.window.showOpenDialog({
    canSelectMany: true,
    openLabel: 'Open Files',
  });
  if (uris) {
    uris.forEach((uri) => vscode.workspace.openTextDocument(uri).then((doc) => vscode.window.showTextDocument(doc)));
  }
});