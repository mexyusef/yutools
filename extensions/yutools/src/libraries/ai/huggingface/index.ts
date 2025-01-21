import * as vscode from 'vscode';
import { HuggingFaceService } from './HuggingFace';
import * as fs from 'fs';
import { removeLeadingCommentWithStatus } from '../gemini/v2/utils';
import { getConfigValue } from '@/configs';
import { register_image_vision_commands } from './image_vision_commands';

export async function handleHuggingfacePrompt(prefix = '', suffix = '') {
  const client = new HuggingFaceService();

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }
  const document = editor.document;
  const selection = editor.selection;
  let inputPrompt: string | undefined;

  const showInputBoxForPrompt = vscode.workspace.getConfiguration('yutools').get<boolean>('showInputBoxForPrompt', false);
  if (showInputBoxForPrompt) {
    const inputBoxPrompt = await vscode.window.showInputBox({ prompt: "Enter input for LLM" });
    if (!inputBoxPrompt) {
      vscode.window.showErrorMessage("No input provided.");
      return;
    }
    let additionalPrompt: string | undefined;
    if (!selection.isEmpty) {
      additionalPrompt = document.getText(selection);
    } else {
      const currentLineText = document.lineAt(selection.start.line).text.trim();
      if (currentLineText) {
        additionalPrompt = currentLineText;
      } else {
        additionalPrompt = document.getText();
        if (!additionalPrompt.trim()) {
          additionalPrompt = await vscode.window.showInputBox({ prompt: "Enter additional input for LLM" });
        }
      }
    }
    inputPrompt = inputBoxPrompt + '\n---\n' + (additionalPrompt || '');
  } else {
    if (!selection.isEmpty) {
      inputPrompt = document.getText(selection);
    } else {
      const currentLineText = document.lineAt(selection.start.line).text.trim();
      if (currentLineText) {
        inputPrompt = currentLineText;
      } else {
        inputPrompt = await vscode.window.showInputBox({ prompt: "Enter input for LLM" });
      }
    }
  }
  if (!inputPrompt) {
    vscode.window.showErrorMessage("No input provided.");
    return;
  }
  // const { processed, isComment } = removeLeadingCommentWithStatus(inputPrompt);
  let processed = inputPrompt;
  let isComment = false;
  if (!showInputBoxForPrompt) {
    ({ processed, isComment } = removeLeadingCommentWithStatus(inputPrompt));
  }
  try {
    const responseText = await client.generateText(prefix + processed + suffix);
    // await editor.edit((editBuilder) => {
    //   if (!selection.isEmpty) {
    //     editBuilder.replace(selection, responseText);
    //   } else if (currentLine.text.trim()) {
    //     if (isComment) {
    //       const positionAfterLine = new vscode.Position(currentLine.lineNumber + 1, 0);
    //       editBuilder.insert(positionAfterLine, `${responseText}\n`);
    //     } else {
    //       editBuilder.replace(currentLine.range, responseText);
    //     }
    //   } else {
    //     editBuilder.insert(selection.active, responseText);
    //   }
    // });
    // vscode.window.showInformationMessage("LLM response successfully inserted.");
    const showLLMResponseBeside = vscode.workspace.getConfiguration('yutools').get<boolean>('showLLMResponseBeside', false);
    if (showLLMResponseBeside) {
      const newDocument = await vscode.workspace.openTextDocument({ content: responseText });
      await vscode.window.showTextDocument(newDocument, { viewColumn: vscode.ViewColumn.Beside });
      return;
    }
    await editor.edit((editBuilder) => {
      if (!selection.isEmpty) {
        editBuilder.replace(selection, responseText);
      } else {
        const currentLine = document.lineAt(selection.start.line);
        if (currentLine.text.trim()) {
          if (isComment) {
            const positionAfterLine = new vscode.Position(currentLine.lineNumber + 1, 0);
            editBuilder.insert(positionAfterLine, `${responseText}\n`);
          } else {
            editBuilder.replace(currentLine.range, responseText);
          }
        } else {
          editBuilder.insert(selection.active, responseText);
        }
      }
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error during LLM processing: ${error.message}`);
  }

}

const sendPrompt = vscode.commands.registerCommand('yutools.llm.huggingface.sendPrompt', async () => {
  await handleHuggingfacePrompt();
});

const sendPromptCode = vscode.commands.registerCommand('yutools.llm.huggingface.sendPromptCode', async () => {
  await handleHuggingfacePrompt(getConfigValue('hiddenPromptPrefix', ''), getConfigValue('hiddenPromptSuffix', ''));
});

const sendPromptWithFilePrefix = vscode.commands.registerCommand('yutools.llm.huggingface.sendPromptWithFilePrefix', async () => {
  const filePath = vscode.workspace.getConfiguration('yutools').get<string>('fmusLLMPrompt');
  if (!filePath) {
    vscode.window.showErrorMessage("No file path configured for 'yutools.fmusLLMPrompt'.");
    return;
  }
  try {
    const prefix = fs.readFileSync(filePath, 'utf8');
    await handleHuggingfacePrompt(prefix, '');
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error reading file: ${error.message}`);
  }
});

export function register_huggingface_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    sendPrompt,
    sendPromptCode,
    sendPromptWithFilePrefix,
  );

  register_image_vision_commands(context);
}