import * as vscode from 'vscode';
import { EditorInserter } from '../editor_inserter';

/**
 * Replaces the specified placeholder in the active editor with the provided text.
 * @param placeholder The string to replace (e.g., "__REPLACE_CONTENT_HERE__").
 * @param replacement The text to insert in place of the placeholder.
 * @param indentation Optional indentation to apply to the replacement text (e.g., "\t", "    ", "  ").
 */
export async function replaceInActiveEditor(
  placeholder: string,
  replacement: string,
  indentation: string = ""
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  const document = editor.document;
  const text = document.getText();

  // Apply indentation to each line of the replacement text
  const indentedReplacement = replacement
    .split("\n")
    .map((line) => indentation + line)
    .join("\n");

  // Replace the placeholder with the indented replacement text
  const updatedText = text.replace(placeholder, indentedReplacement);

  // // Apply the changes to the document
  // const fullRange = new vscode.Range(
  //   document.positionAt(0),
  //   document.positionAt(text.length)
  // );

  // await editor.edit((editBuilder) => {
  //   editBuilder.replace(fullRange, updatedText);
  // });
  EditorInserter.insertTextInNewEditor(updatedText);
}