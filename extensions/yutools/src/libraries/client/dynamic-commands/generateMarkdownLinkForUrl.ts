import * as vscode from 'vscode';
import { getSelectedText } from './getSelectedText';
import { parseSelectedText } from './parseSelectedText';
import { EditorInserter } from '../editors/editor_inserter';
import { perintah } from './perintah';

export const generateMarkdownLinkForUrl = vscode.commands.registerCommand('yutools.dynamic-commands.generateMarkdownLinkForUrl', () => {
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
  const markdownLink = `[Buka URL](command:yutools.dynamic-commands.openDynamicUrl?${encodedArgs} "Buka URL di browser")`;

  EditorInserter.insertTextInNewEditor(markdownLink + perintah);

  // Copy the Markdown link to the clipboard
  vscode.env.clipboard.writeText(markdownLink).then(() => {
    vscode.window.showInformationMessage('Markdown link generated and copied to clipboard.');
  });
});
