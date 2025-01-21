import * as vscode from "vscode";
// import { GeminiAI } from "./GeminiAI";
import {
  // removeLeadingComment,
  removeLeadingCommentWithStatus
} from "./utils";
import { getConfigValue } from "@/configs";
import * as fs from 'fs';
import { GeminiClientSingleton } from "./GeminiClientSingleton";


export async function handleGeminiCommand(prefix = '', suffix = '') {
  const gemini = GeminiClientSingleton.getInstance(); // new GeminiAI();

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
    let responseText = "";
    await gemini.generateTextStream(
      prefix + processed + suffix,
      (chunk) => {
        responseText += chunk; // Collect streamed chunks
      }
    );

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

export async function handleGeminiStreamingCommand() {
  const gemini = GeminiClientSingleton.getInstance(); // new GeminiAI();

  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("No active editor found.");
    return;
  }

  const document = editor.document;
  const selection = editor.selection;

  // Determine the input for LLM
  let inputPrompt: string | undefined;
  const currentLine = document.lineAt(selection.start.line);

  if (!selection.isEmpty) {
    // Use selected text
    inputPrompt = document.getText(selection);
  } else if (currentLine.text.trim()) {
    // Use current line text if it's not empty
    inputPrompt = currentLine.text.trim();
  } else {
    // Ask for user input
    inputPrompt = await vscode.window.showInputBox({ prompt: "Enter input for LLM" });
  }

  if (!inputPrompt) {
    vscode.window.showErrorMessage("No input provided.");
    return;
  }

  // Preprocess the prompt to check for comments and remove them
  const { processed, isComment } = removeLeadingCommentWithStatus(inputPrompt);

  try {
    let insertPosition: vscode.Position;

    await editor.edit((editBuilder) => {
      if (!selection.isEmpty) {
        // Replace selected text and start inserting at the selection start
        editBuilder.replace(selection, "");
        insertPosition = selection.start;
      } else if (currentLine.text.trim()) {
        if (isComment) {
          // Add a new line after the current line and start inserting there
          insertPosition = new vscode.Position(currentLine.lineNumber + 1, 0);
        } else {
          // Replace the current line and start inserting there
          editBuilder.replace(currentLine.range, "");
          insertPosition = currentLine.range.start;
        }
      } else {
        // Start inserting at the cursor position
        insertPosition = selection.active;
      }
    });

    // Stream response from Gemini LLM and insert chunk-by-chunk
    await gemini.generateTextStream(processed, async (chunk) => {
      await editor.edit((editBuilder) => {
        editBuilder.insert(insertPosition, chunk);
        insertPosition = insertPosition.translate(0, chunk.length); // Move the position forward
      });
    });

    vscode.window.showInformationMessage("LLM streaming response successfully inserted.");
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error during LLM streaming: ${error.message}`);
  }
}

const geminiStreamCollected = vscode.commands.registerCommand("yutools.geminiv2.geminiStreamCollected", async () => {
  await handleGeminiCommand();
});

const geminiStream = vscode.commands.registerCommand("yutools.geminiv2.geminiStream", async () => {
  await handleGeminiStreamingCommand();
});

const sendPromptWithFilePrefix = vscode.commands.registerCommand('yutools.llm.gemini.sendPromptWithFilePrefix', async () => {
  const filePath = vscode.workspace.getConfiguration('yutools').get<string>('fmusLLMPrompt');
  if (!filePath) {
    vscode.window.showErrorMessage("No file path configured for 'yutools.fmusLLMPrompt'.");
    return;
  }
  try {
    const prefix = fs.readFileSync(filePath, 'utf8');
    await handleGeminiCommand(prefix, '');
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error reading file: ${error.message}`);
  }
});

export function register_gemini_v2_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(geminiStreamCollected);
  context.subscriptions.push(geminiStream);
  context.subscriptions.push(sendPromptWithFilePrefix);
  context.subscriptions.push(
    vscode.commands.registerCommand("yutools.llm.gemini.sendPromptCode", async () => {
      await handleGeminiCommand(getConfigValue('hiddenPromptPrefix', ''), getConfigValue('hiddenPromptSuffix', ''));
    })
  );
}
