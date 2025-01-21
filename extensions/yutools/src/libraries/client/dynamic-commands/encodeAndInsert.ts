import * as vscode from 'vscode';
import { EditorInserter } from '../editors/editor_inserter';
import { getSelectedText } from './getSelectedText';
import { encodeSelectedText } from './encodeSelectedText';

// Command 1: Encode and Insert in New Editor
export const encodeAndInsert = vscode.commands.registerCommand('yutools.uri-encoder.encodeAndInsert', () => {
  const selectedText = getSelectedText();
  if (selectedText) {
    const encodedText = encodeSelectedText(selectedText);
    EditorInserter.insertTextInNewEditor(encodedText);
  }
});
