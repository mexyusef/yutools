import * as vscode from 'vscode';
import { replaceInActiveEditor } from './replaceInActiveEditor';

export const replaceWithUserInput = vscode.commands.registerCommand('yutools.editors.strings.replaceWithUserInput', async () => {
  const placeholder = "__REPLACE_CONTENT_HERE__";
  const userInput = await vscode.window.showInputBox({
    prompt: "Enter the replacement text",
    placeHolder: "Replacement text",
  });

  if (userInput !== undefined) {
    await replaceInActiveEditor(placeholder, userInput);
  }
});

export const replaceWithUserInputWithIndent = vscode.commands.registerCommand('yutools.editors.strings.replaceWithUserInputWithIndent', async () => {
  const placeholder = "__REPLACE_CONTENT_HERE__";
  const userInput = await vscode.window.showInputBox({
      prompt: "Enter the replacement text",
      placeHolder: "Replacement text",
  });

  if (userInput !== undefined) {
      const indentation = await vscode.window.showQuickPick(["None", "Tab", "4 Spaces", "2 Spaces"], {
          placeHolder: "Select indentation (default: None)",
      });

      const indentationValue = indentation === "Tab" ? "\t" :
          indentation === "4 Spaces" ? "    " :
          indentation === "2 Spaces" ? "  " : "";

      await replaceInActiveEditor(placeholder, userInput, indentationValue);
  }
})