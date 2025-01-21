import * as vscode from 'vscode';

export function getSelectedText(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active editor found.');
    return undefined;
  }
  const selection = editor.selection;
  return editor.document.getText(selection);
}
