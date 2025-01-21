import * as vscode from 'vscode';


export async function copyTextToClipboard(text: string): Promise<void> {
  await vscode.env.clipboard.writeText(text);
}


export async function getTextFromClipboard(): Promise<string> {
  const clipboardText = await vscode.env.clipboard.readText();
  return clipboardText;
}


export async function insertTextAtCursorFromClipboard(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No open text editor
  }

  const clipboardText = await vscode.env.clipboard.readText();
  const selection = editor.selection;
  editor.edit(editBuilder => {
    editBuilder.insert(selection.active, clipboardText);
  });
}
