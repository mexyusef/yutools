import * as vscode from 'vscode';
import { EditorStreamHandler } from './editor_streamer';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { geminiSettings } from '@/libraries/ai/config';


export async function streamGeminiResponse() {
  const genAI = new GoogleGenerativeAI(geminiSettings.getNextProvider().key);

  const userPrompt = await vscode.window.showInputBox({
    prompt: 'Enter your prompt for Gemini',
    placeHolder: 'What would you like the Gemini AI to do?'
  });

  if (!userPrompt) return;

  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const model = genAI.getGenerativeModel({ model: geminiSettings.getConfig().model });
  const chat = model.startChat({
    history: []
  });

  const handler = new EditorStreamHandler(editor);

  try {
    const result = await chat.sendMessageStream(userPrompt);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      await handler.handleChunk(text);
    }
    await handler.complete();
  } catch (error: any) {
    vscode.window.showErrorMessage(`Gemini stream error: ${error.message}`);
  }
}
