import * as vscode from 'vscode';

export const detect_image_filepath = vscode.commands.registerCommand(`yutools.detect_image_filepath`, () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active text editor found.');
    return;
  }

  const document = editor.document;
  const selection = editor.selection;
  const line = document.lineAt(selection.active.line);
  const lineText = line.text;

  // Regex to match absolute file paths for .jpg and .png files
  // const imagePathRegex = /(\/[^\s\/]+\/[^\s\/]+\.(jpg|png))/g;
  // Regex to match both Unix and Windows absolute paths for .jpg and .png files
  // const imagePathRegex = /([a-zA-Z]:\\[^\s\\]+\\[^\s\\]+\.(jpg|png)|\/[^\s\/]+\/[^\s\/]+\.(jpg|png))/g;
  const imagePathRegex = /([a-zA-Z]:\\[^\s\\]+\.(jpg|png)|\/[^\s\/]+\.(jpg|png))/g;
  const matches = lineText.match(imagePathRegex);

  if (matches && matches.length > 0) {
    vscode.window.showInformationMessage(`Detected image file paths: ${matches.join(', ')}`);
  } else {
    vscode.window.showInformationMessage('No image file paths detected in the current line.');
  }
});