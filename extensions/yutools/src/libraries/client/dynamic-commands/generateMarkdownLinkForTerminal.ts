import * as vscode from 'vscode';
import { getSelectedText } from './getSelectedText';
import { parseSelectedText } from './parseSelectedText';
import { EditorInserter } from '../editors/editor_inserter';
import { perintah } from './perintah';

export const generateMarkdownLinkForTerminal = vscode.commands.registerCommand('yutools.dynamic-commands.generateMarkdownLinkForTerminal', () => {
  const selectedText = getSelectedText();
  if (!selectedText) {
    vscode.window.showErrorMessage('No text selected.');
    return;
  }

  // Parse the selected text as a JavaScript object
  const parsedObject = parseSelectedText(selectedText);
  if (!parsedObject) {
    return;
  }

  // Convert the object to a URL-encoded JSON string
  const encodedArgs = encodeURIComponent(JSON.stringify(parsedObject));

  // Generate the Markdown link
  const markdownLink = `[Perintah versi otomatis](command:yutools.dynamic-commands.openTerminalWithArgs?${encodedArgs} "Jalankan openTerminalWithArgs")`;

  // // Insert the Markdown link into a new editor
  // const editor = vscode.window.activeTextEditor;
  // if (editor) {
  //   editor.edit((editBuilder) => {
  //     editBuilder.insert(editor.selection.active, markdownLink);
  //   });
  // }
  EditorInserter.insertTextInNewEditor(markdownLink + perintah);

  // Copy the Markdown link to the clipboard
  vscode.env.clipboard.writeText(markdownLink).then(() => {
    vscode.window.showInformationMessage('Markdown link generated and copied to clipboard.');
  });
});
