import * as vscode from 'vscode';
import { BrowserClient } from '../../core/BrowserClient';
import { navigate, type, pressKey } from '../..';
import { GLHFLLMClient } from '@/libraries/ai/glhf/glhf';
import { readPromptFromFile } from '@/libraries/prompts/collections/readPromptFromFile';
import { glhfSettings } from '@/libraries/ai/config';

const promptFilePath = 'C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\prompts\\collections\\prompt.web-quick2.md';

export async function generateRandomEnterpriseApp() {

  const llm = new GLHFLLMClient();

  const client = new BrowserClient('chromium');
  await client.launch({ 
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false
  });

  try {
    const filePrompt = await readPromptFromFile(promptFilePath);

    const llmResponse = await llm.createCompletion({
      messages: [
        { role: 'system', content: glhfSettings.getConfig().systemPrompt as string },
        { role: 'user', content: filePrompt },
      ],
    }) as string;

    // Use the LLM's response as the new prompt
    const prompt = llmResponse.trim();

    await navigate(client, 'https://deepseek-artifacts.vercel.app/');

    // Wait for the input field to load
    await client.waitForSelector('#description', 60_000);

    // Type the prompt into the input field
    // const prompt = 'Create a full-stack ecommerce app with React and Node.js';
    await type(client, '#description', prompt);

    // Press Enter to submit the prompt
    await pressKey(client, '#description', 'Enter');

    vscode.window.showInformationMessage('Prompt submitted successfully!');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to generate full-stack app: ${error}`);
  }
}