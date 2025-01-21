import * as vscode from 'vscode';
import { replaceInActiveEditor } from './replaceInActiveEditor';

export const replaceWithClipboard = vscode.commands.registerCommand('yutools.editors.strings.replaceWithClipboard', async () => {
  const placeholder = "__REPLACE_CONTENT_HERE__";
  const clipboardText = await vscode.env.clipboard.readText();

  if (clipboardText) {
    await replaceInActiveEditor(placeholder, clipboardText);
  } else {
    vscode.window.showErrorMessage("Clipboard is empty or contains no text.");
  }
})

export const replaceWithClipboardWithIndent = vscode.commands.registerCommand('yutools.editors.strings.replaceWithClipboardWithIndent', async () => {
  const placeholder = "__REPLACE_CONTENT_HERE__";
  const clipboardText = await vscode.env.clipboard.readText();

  if (clipboardText) {
    const indentation = await vscode.window.showQuickPick(["None", "Tab", "4 Spaces", "2 Spaces"], {
      placeHolder: "Select indentation (default: None)",
    });

    const indentationValue = indentation === "Tab" ? "\t" :
      indentation === "4 Spaces" ? "    " :
        indentation === "2 Spaces" ? "  " : "";

    await replaceInActiveEditor(placeholder, clipboardText, indentationValue);
  } else {
    vscode.window.showErrorMessage("Clipboard is empty or contains no text.");
  }
})