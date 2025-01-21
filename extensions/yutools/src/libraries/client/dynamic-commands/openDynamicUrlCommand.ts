import * as vscode from "vscode";
import open from 'open';

export const openDynamicUrlCommand = vscode.commands.registerCommand("yutools.dynamic-commands.openDynamicUrl",
  (args) => {

    const { url } = args;

    if (!url) {
      vscode.window.showErrorMessage('No URL provided.');
      return;
    }

    // Open the URL in the default browser
    open(url).catch((err: any) => {
      vscode.window.showErrorMessage(`Failed to open URL: ${err.message}`);
    });

  }
);