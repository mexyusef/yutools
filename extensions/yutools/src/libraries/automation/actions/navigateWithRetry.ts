import * as vscode from 'vscode';
import { BrowserClient } from '../core/BrowserClient';

export async function navigateWithRetry(
  client: BrowserClient,
  url: string,
  timeout: number = 60000,
  retries: number = 3
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await client.goto(url, timeout);
      console.log(`Navigated to: ${url}`);
      return; // Success, exit the function
    } catch (error) {
      if (attempt === retries) {
        // Final attempt failed, throw the error
        if (error instanceof Error && error.message.includes('Timeout')) {
          console.error(`Navigation to ${url} timed out after ${timeout}ms.`);
          vscode.window.showErrorMessage(
            `The page took too long to load. Please check your network connection or increase the timeout.`
          );
        } else {
          console.error(`Failed to navigate to: ${url}`, error);
          vscode.window.showErrorMessage(`Failed to navigate to: ${url}. Error: ${error}`);
        }
        throw error;
      } else {
        console.warn(`Attempt ${attempt} failed. Retrying...`);
      }
    }
  }
}