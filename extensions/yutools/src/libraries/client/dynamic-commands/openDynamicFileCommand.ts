import * as vscode from "vscode";

export const openDynamicFileCommand = vscode.commands.registerCommand("yutools.dynamic-commands.openDynamicFile",
  (args) => {
    const { filePath } = args;

    if (!filePath) {
      vscode.window.showErrorMessage("No file path provided.");
      return;
    }

    // Open the file in the editor
    vscode.workspace.openTextDocument(filePath).then(
      (doc) => {
        vscode.window.showTextDocument(doc, { preview: false });
      },
      (err) => {
        vscode.window.showErrorMessage(`Failed to open file: ${filePath}`);
      }
    );
  }
);