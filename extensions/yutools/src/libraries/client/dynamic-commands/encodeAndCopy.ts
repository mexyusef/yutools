import * as vscode from 'vscode';
import { getSelectedText } from './getSelectedText';
import { encodeSelectedText } from './encodeSelectedText';

// Command 2: Encode and Copy to Clipboard
export const encodeAndCopy = vscode.commands.registerCommand('yutools.uri-encoder.encodeAndCopy', () => {
  const selectedText = getSelectedText();
  if (selectedText) {
    const encodedText = encodeSelectedText(selectedText);
    vscode.env.clipboard.writeText(encodedText).then(() => {
      vscode.window.showInformationMessage('Encoded text copied to clipboard.');
    });
  }
});
