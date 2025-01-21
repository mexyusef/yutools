import * as vscode from 'vscode';
import GroqClient from './groq-utils';
import * as fs from 'fs';
import { removeLeadingCommentWithStatus } from '../gemini/v2/utils';
import { getConfigValue } from '@/configs';
import { register_groq_vision_commands } from './vision_commands';

export async function handleGroqPrompt(prefix = '', suffix = '') {
  const client = new GroqClient();
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
    const responseText = await client.sendPrompt(prefix + processed + suffix);

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
const sendPromptCommand = vscode.commands.registerCommand('yutools.llm.groq.sendPrompt', async () => {
  await handleGroqPrompt();
});

const sendPromptCode = vscode.commands.registerCommand('yutools.llm.groq.sendPromptCode', async () => {
  await handleGroqPrompt( getConfigValue('hiddenPromptPrefix', ''), getConfigValue('hiddenPromptSuffix', '') );
});

const streamPromptCommand = vscode.commands.registerCommand('yutools.llm.groq.streamPrompt', async () => {
  const groqClient = new GroqClient();
  const prompt = await vscode.window.showInputBox({ prompt: 'Enter your prompt:' });
  if (prompt) {
    const outputChannel = vscode.window.createOutputChannel('Groq Stream');
    outputChannel.show();

    await groqClient.streamPrompt(prompt, (data: string) => {
      outputChannel.append(data);
    });
  }
});

const sendPromptWithFilePrefix = vscode.commands.registerCommand('yutools.llm.groq.sendPromptWithFilePrefix', async () => {
  const filePath = vscode.workspace.getConfiguration('yutools').get<string>('fmusLLMPrompt');
  if (!filePath) {
    vscode.window.showErrorMessage("No file path configured for 'yutools.fmusLLMPrompt'.");
    return;
  }
  try {
    const prefix = fs.readFileSync(filePath, 'utf8');
    await handleGroqPrompt(prefix, '');
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error reading file: ${error.message}`);
  }
});

export function register_groq_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    sendPromptWithFilePrefix,
    sendPromptCommand,
    streamPromptCommand,
    sendPromptCode,
  );
  register_groq_vision_commands(context);
}
