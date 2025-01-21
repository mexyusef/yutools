import { BrowserClient } from '../../core/BrowserClient';
import { navigate, type, pressKey } from '../..';
import * as vscode from 'vscode';

export async function generateFullstackAppFromInput() {
  const client = new BrowserClient('chromium');
  await client.launch({ 
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false
  });

  try {
    const defaultPrompt = 'Create a full-stack ecommerce app with React and Node.js';
    let prompt;
    prompt = await vscode.window.showInputBox({
      prompt: 'Enter your project description (Press Enter for default)',
      placeHolder: defaultPrompt,
      value: defaultPrompt,
    });

    if (!prompt) {
      prompt = defaultPrompt;
      // vscode.window.showWarningMessage('No prompt entered. Exiting...');
      // return;
    }

    await navigate(client, 'https://deepseek-artifacts.vercel.app/');

    // Wait for the input field to load
    await client.waitForSelector('#description', 60_000);

    // Type the prompt into the input field
    await type(client, '#description', prompt);

    // Press Enter to submit the prompt
    await pressKey(client, '#description', 'Enter');

    vscode.window.showInformationMessage('Prompt submitted successfully!');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to generate full-stack app: ${error}`);
  // } finally {
  //   await client.close();
  }
}