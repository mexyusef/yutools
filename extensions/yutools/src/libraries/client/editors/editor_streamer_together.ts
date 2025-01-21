import * as vscode from 'vscode';
import OpenAI from 'openai';
import { EditorStreamHandler } from './editor_streamer';
import { togetherSettings } from '@/libraries/ai/config';

export async function streamTogetherResponse() {
  const openai = new OpenAI({
    apiKey: togetherSettings.getNextProvider().key,
    baseURL: 'https://api.together.xyz/v1',
  });

  const userPrompt = await vscode.window.showInputBox({
    prompt: 'Enter your prompt',
    placeHolder: 'What would you like the AI to do?'
  });

  if (!userPrompt) return;

  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const stream = await openai.chat.completions.create({
    model: togetherSettings.getConfig().model,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful coding assistant. Provide clear, concise responses.'
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    stream: true
  });

  const handler = new EditorStreamHandler(editor);

  try {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      await handler.handleChunk(content);
    }
    await handler.complete();
  } catch (error: any) {
    vscode.window.showErrorMessage(`OpenAI stream error: ${error.message}`);
  }
}
