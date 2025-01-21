import { HFInferenceClient } from '@/libraries/ai/huggingface/HFClaude';
import * as vscode from 'vscode';
import { EditorStreamHandler } from './editor_streamer';
import { HuggingFaceService } from '@/libraries/ai/huggingface/HuggingFace';


// // Settings interface (you might want to put this in a separate file)
// export interface HuggingFaceSettings {
//   apiKey: string;
//   model: string;
//   maxTokens: number;
//   temperature: number;
//   topP: number;
// }

// // Settings helper (you might want to put this in a separate file)
// export class HuggingFaceSettingsManager {
//   private static readonly CONFIG_SECTION = 'huggingface';

//   static getSettings(): HuggingFaceSettings {
//     const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
//     return {
//       apiKey: config.get('apiKey', ''),
//       model: config.get('model', 'mistralai/Mistral-7B-Instruct-v0.1'),
//       maxTokens: config.get('maxTokens', 1000),
//       temperature: config.get('temperature', 0.7),
//       topP: config.get('topP', 0.95)
//     };
//   }
// }

export async function streamHuggingFaceResponse() {
  const userPrompt = await vscode.window.showInputBox({
    prompt: 'Enter your prompt',
    placeHolder: 'What would you like the AI to do?'
  });

  if (!userPrompt) return;

  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const hf = new HFInferenceClient();

  const handler = new EditorStreamHandler(editor);

  try {
    // Start the streaming text generation
    const stream = hf.generateTextStream(
      userPrompt,
    );

    for await (const chunk of stream) {
      const content = chunk.token?.text || '';
      await handler.handleChunk(content);
    }

    await handler.complete();
  } catch (error: any) {
    vscode.window.showErrorMessage(`HuggingFace stream error: ${error.message}`);
  }
}

export async function streamHuggingFaceResponseOAI() {
  const userPrompt = await vscode.window.showInputBox({
    prompt: 'Enter your prompt',
    placeHolder: 'What would you like the AI to do?'
  });

  if (!userPrompt) return;
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const hf = new HuggingFaceService();
  const handler = new EditorStreamHandler(editor);
  try {
    // Start the streaming text generation
    const stream = hf.generateTextStream(
      userPrompt,
    );

    for await (const chunk of stream) {
      // const content = chunk.token?.text || '';
      await handler.handleChunk(chunk);
    }

    await handler.complete();
  } catch (error: any) {
    vscode.window.showErrorMessage(`HuggingFace stream error: ${error.message}`);
  }
}

// Optional: Create a version with system prompt support
export async function streamHuggingFaceResponseWithSystem() {
  const userPrompt = await vscode.window.showInputBox({
    prompt: 'Enter your prompt',
    placeHolder: 'What would you like the AI to do?'
  });

  if (!userPrompt) return;

  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const hf = new HFInferenceClient(
    // {
    //   apiKey: process.env.HUGGINGFACE_API_KEY || '',
    //   defaultModel: 'mistralai/Mistral-7B-Instruct-v0.1'
    // }
  );

  const handler = new EditorStreamHandler(editor);

  try {
    // Format prompt with system message
    const formattedPrompt = `<system>You are a helpful coding assistant. Provide clear, concise responses.</system>\n<user>${userPrompt}</user>\n<assistant>`;

    const stream = hf.generateTextStream(
      formattedPrompt,
      // {
      //   maxTokens: 1000,
      //   temperature: 0.7,
      //   topP: 0.95,
      //   stopSequences: ['</assistant>'] // Stop when the assistant's response is complete
      // }
    );

    for await (const chunk of stream) {
      const content = chunk.token?.text || '';
      await handler.handleChunk(content);
    }

    await handler.complete();
  } catch (error: any) {
    vscode.window.showErrorMessage(`HuggingFace stream error: ${error.message}`);
  }
}

// Register basic streaming command
const disposableBasic = vscode.commands.registerCommand('yutools.streaming.huggingface.streamResponse', streamHuggingFaceResponse);

const streamResponseOAI = vscode.commands.registerCommand('yutools.streaming.huggingface.streamResponseOAI', streamHuggingFaceResponseOAI);

// Register streaming with system prompt command
const disposableWithSystem = vscode.commands.registerCommand('yutools.streaming.huggingface.streamResponseWithSystem',
  streamHuggingFaceResponseWithSystem
);

export function register_huggingface_streaming(context: vscode.ExtensionContext) {
  context.subscriptions.push(disposableBasic, disposableWithSystem, streamResponseOAI);
}
