import * as vscode from 'vscode';
import { EditorInserter } from '../editors/editor_inserter';
import { getSelectedText } from './getSelectedText';
import { encodeSelectedText } from './encodeSelectedText';
import { askForText } from '../inputs';

export const encodeInsertAndCopy = vscode.commands.registerCommand('yutools.uri-encoder.encodeInsertAndCopy', async () => {
  let selectedText: string | undefined;
  selectedText = getSelectedText();
  if (!selectedText) {
    selectedText = await askForText("Masukkan data untuk diencode (string, json, dll)") || "sample text";
  }
  const encodedText = encodeSelectedText(selectedText);
  EditorInserter.insertTextInNewEditor(encodedText);
  vscode.env.clipboard.writeText(encodedText).then(() => {
    vscode.window.showInformationMessage('Encoded text inserted and copied to clipboard.');
  });
});