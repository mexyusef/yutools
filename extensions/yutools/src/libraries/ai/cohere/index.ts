import * as vscode from 'vscode';
import * as fs from 'fs';
import { CohereLLMClient, CohereLLMClientSingleton } from './cohere';
import { removeLeadingCommentWithStatus } from '../gemini/v2/utils';
import { cohereSettings } from '../config';
import { getConfigValue } from '@/configs';

export async function handleCoherePrompt(prefix = '', suffix = '') {
  // const client = new CohereLLMClient();
  const client = CohereLLMClientSingleton.getInstance();
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
    const responseText = await client.createCompletion({
      messages: [
        { role: 'system', content: cohereSettings.getConfig().systemPrompt as string },
        { role: 'user', content: prefix + processed + suffix },
      ],
      // model: 'Meta-Llama-3.1-405B-Instruct',
    }) as string;

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

export function register_cohere_commands(context: vscode.ExtensionContext) {
  const sendPrompt = vscode.commands.registerCommand('yutools.llm.cohere.sendPrompt', async () => {
    await handleCoherePrompt();
  });

  const sendPromptCode = vscode.commands.registerCommand('yutools.llm.cohere.sendPromptCode', async () => {
    await handleCoherePrompt(
      getConfigValue('hiddenPromptPrefix', ''),
      getConfigValue('hiddenPromptSuffix', '')
    );
  });

  const sendPromptStream = vscode.commands.registerCommand('yutools.llm.cohere.sendPromptStream', async () => {
    // const client = new CohereLLMClient();
    const client = CohereLLMClientSingleton.getInstance();
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }

    const prompt = editor.document.getText(editor.selection);
    if (!prompt) {
      vscode.window.showErrorMessage('No text selected. Please select a prompt to send.');
      return;
    }

    try {
      const stream = await client.createCompletion({
        messages: [
          { role: 'system', content: cohereSettings.getConfig().systemPrompt as string },
          { role: 'user', content: prompt },
        ],
        model: 'command-r-plus-08-2024',
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        vscode.window.showInformationMessage(`Streaming Response: ${chunk}`);
      }

      vscode.window.showInformationMessage(`Final Response: ${fullResponse}`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error fetching LLM response: ${error.message}`);
    }
  });

  const sendPromptWithFilePrefix = vscode.commands.registerCommand('yutools.llm.cohere.sendPromptWithFilePrefix', async () => {
    const filePath = vscode.workspace.getConfiguration('yutools').get<string>('fmusLLMPrompt');
    if (!filePath) {
      vscode.window.showErrorMessage("No file path configured for 'yutools.fmusLLMPrompt'.");
      return;
    }
    try {
      const prefix = fs.readFileSync(filePath, 'utf8');
      await handleCoherePrompt(prefix, '');
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error reading file: ${error.message}`);
    }
  });

  context.subscriptions.push(
    sendPromptWithFilePrefix,
    sendPrompt,
    sendPromptCode,
    sendPromptStream,
  );
}

// // Example usage in CLI:
// (async () => {
//   const client = new CohereLLMClient({});

//   // Standard completion
//   const response = await client.createCompletion({
//     messages: [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: 'Explain quantum mechanics in simple terms.' },
//     ],
//     model: 'command-r-plus-08-2024',
//   });
//   console.log(response);

//   // Streamed completion
//   const stream = await client.createCompletion({
//     messages: [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: 'Explain quantum mechanics in simple terms.' },
//     ],
//     model: 'command-r-plus-08-2024',
//     stream: true,
//   });

//   for await (const chunk of stream) {
//     process.stdout.write(chunk);
//   }
// })();
