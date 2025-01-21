import * as vscode from 'vscode';
import { getConfigValue } from '@/configs';
import * as fs from 'fs';
import { sendPromptStream } from './sendPromptStream';
import { handleGLHFPrompt } from './handleGLHFPrompt';
import { sendPromptWithFilePrefix } from './sendPromptWithFilePrefix';
import { handleGLHFPromptConfigPresets } from './handleGLHFPromptConfigPresets';

const sendPrompt = vscode.commands.registerCommand('yutools.llm.glhf.sendPrompt', async () => {
  await handleGLHFPrompt();
});

const sendPromptCode = vscode.commands.registerCommand('yutools.llm.glhf.sendPromptCode', async () => {
  await handleGLHFPrompt(getConfigValue('hiddenPromptPrefix', ''), getConfigValue('hiddenPromptSuffix', ''));
});

const sendPromptWithPresets = vscode.commands.registerCommand('yutools.llm.glhf.sendPromptWithPresets', async () => {
  await handleGLHFPromptConfigPresets();
});

export function register_glhf_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    sendPromptStream,
    sendPromptWithFilePrefix,
    sendPromptWithPresets,
    sendPrompt,
    sendPromptCode,
  );
}
