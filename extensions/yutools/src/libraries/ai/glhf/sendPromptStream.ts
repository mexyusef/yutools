import * as vscode from 'vscode';
import { GLHFLLMClientSingleton } from './glhf';

export const sendPromptStream = vscode.commands.registerCommand('yutools.llm.glhf.sendPromptStream', async () => {
  // const client = new GLHFLLMClient();
  const client = GLHFLLMClientSingleton.getInstance();
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
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      model: 'hf:mistralai/Mistral-7B-Instruct-v0.3',
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