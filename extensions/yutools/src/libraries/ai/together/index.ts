import * as vscode from 'vscode';
import * as fs from 'fs';
import { TogetherAILLMClient } from './together';
import { removeLeadingCommentWithStatus } from '../gemini/v2/utils';
import { togetherSettings } from '../config';
import { register_together_vision_commands } from './vision_commands';
import { register_together_image_commands } from './image_commands';
import { getConfigValue } from '@/configs';

export async function handleTogetherPrompt(prefix = '', suffix = '') {
  const client = new TogetherAILLMClient();
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }
  const document = editor.document;
  const selection = editor.selection;
  let inputPrompt: string | undefined;
  // const currentLine = document.lineAt(selection.start.line);
  // if (!selection.isEmpty) {
  //   // Use selected text
  //   inputPrompt = document.getText(selection);
  // } else {
  //   const currentLineText = document.lineAt(selection.start.line).text.trim();
  //   if (currentLineText) {
  //     // Use current line text
  //     inputPrompt = currentLineText;
  //   } else {
  //     // Ask for user input
  //     inputPrompt = await vscode.window.showInputBox({ prompt: "Enter input for LLM" });
  //   }
  // }
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
        { role: 'system', content: togetherSettings.getConfig().systemPrompt as string },
        { role: 'user', content: prefix + processed + suffix },
      ],
    }) as string;

    // await editor.edit((editBuilder) => {
    //   if (!selection.isEmpty) {
    //     // Replace selected text
    //     editBuilder.replace(selection, responseText);
    //   } else if (currentLine.text.trim()) {
    //     if (isComment) {
    //       // Add a new line after the current line and insert the response
    //       const positionAfterLine = new vscode.Position(currentLine.lineNumber + 1, 0);
    //       editBuilder.insert(positionAfterLine, `${responseText}\n`);
    //     } else {
    //       // Replace the current line with the response
    //       editBuilder.replace(currentLine.range, responseText);
    //     }
    //   } else {
    //     // Insert at the current cursor position
    //     editBuilder.insert(selection.active, responseText);
    //   }
    // });
    const showLLMResponseBeside = vscode.workspace.getConfiguration('yutools').get<boolean>('showLLMResponseBeside', false);
    if (showLLMResponseBeside) {
      // Create a new untitled document with the responseText
      const newDocument = await vscode.workspace.openTextDocument({ content: responseText }); 
      // Show the new document in a new editor beside the current one
      await vscode.window.showTextDocument(newDocument, { viewColumn: vscode.ViewColumn.Beside });
      // Return early since we don't want to modify the current editor
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
    // vscode.window.showInformationMessage("LLM response successfull inserted.");
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error during LLM processing: ${error.message}`);
  }
}

export function register_together_commands(context: vscode.ExtensionContext) {
  const sendPrompt = vscode.commands.registerCommand('yutools.llm.together.sendPrompt', async () => {
    await handleTogetherPrompt();
  });

  const sendPromptCode = vscode.commands.registerCommand('yutools.llm.together.sendPromptCode', async () => {
    await handleTogetherPrompt(
      getConfigValue('hiddenPromptPrefix', ''),
      getConfigValue('hiddenPromptSuffix', '')
    );
  });

  const sendPromptStream = vscode.commands.registerCommand('yutools.llm.together.sendPromptStream', async () => {
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
    const client = new TogetherAILLMClient();
    try {
      const stream = await client.createCompletion({
        messages: [
          { role: 'system', content: togetherSettings.getConfig().systemPrompt as string },
          { role: 'user', content: prompt },
        ],
        // model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
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

  const sendPromptWithFilePrefix = vscode.commands.registerCommand('yutools.llm.together.sendPromptWithFilePrefix', async () => {
    const filePath = vscode.workspace.getConfiguration('yutools').get<string>('fmusLLMPrompt');
    if (!filePath) {
      vscode.window.showErrorMessage("No file path configured for 'yutools.fmusLLMPrompt'.");
      return;
    }
    try {
      const prefix = fs.readFileSync(filePath, 'utf8');
      await handleTogetherPrompt(prefix, '');
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

  // C:\ai\yuagent\extensions\yutools\src\libraries\ai\together\vision_commands.ts
  // describeImageUrl, describeLocalImage
  register_together_vision_commands(context);

  // C:\ai\yuagent\extensions\yutools\src\libraries\ai\together\image_commands.ts
  // setDefaultSettings, generateImage, uploadImage
  register_together_image_commands(context);

}
