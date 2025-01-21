import * as vscode from 'vscode';
import { streamOpenAIResponse } from './editor_streamer_openai';
import { streamGeminiResponse } from './editor_streamer_gemini';
import { streamXAIResponse } from './editor_streamer_xai';
import { streamTogetherResponse } from './editor_streamer_together';
import { streamSambanovaResponse } from './editor_streamer_sambanova';
import { streamHyperbolicResponse } from './editor_streamer_hyperbolic';
import { register_huggingface_streaming } from './editor_streamer_hf';

export function register_editor_streaming(context: vscode.ExtensionContext) {

  const geminiStream = vscode.commands.registerCommand('yutools.streaming.gemini.streamResponse', streamGeminiResponse);
  const hyperbolicStream = vscode.commands.registerCommand('yutools.streaming.hyperbolic.streamResponse', streamHyperbolicResponse);
  const openaiStream = vscode.commands.registerCommand('yutools.streaming.openai.streamResponse', streamOpenAIResponse);
  const sambanovaStream = vscode.commands.registerCommand('yutools.streaming.sambanova.streamResponse', streamSambanovaResponse);
  const togetherStream = vscode.commands.registerCommand('yutools.streaming.together.streamResponse', streamTogetherResponse);
  const xaiStream = vscode.commands.registerCommand('yutools.streaming.xai.streamResponse', streamXAIResponse);

  context.subscriptions.push(
    openaiStream,
    geminiStream,
    togetherStream,
    hyperbolicStream, sambanovaStream, xaiStream,
  );

  register_huggingface_streaming(context);
}
