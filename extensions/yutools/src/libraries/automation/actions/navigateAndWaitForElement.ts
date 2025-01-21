import * as vscode from 'vscode';
import { BrowserClient } from '../core/BrowserClient';

export async function navigateAndWaitForElement(
  client: BrowserClient,
  url: string,
  selector: string,
  timeout: number = 60000
) {
  try {
    await client.goto(url, timeout);
    console.log(`Navigated to: ${url}`);

    // Wait for a specific element to appear
    await client.waitForSelector(selector, timeout);
    console.log(`Element found: ${selector}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Timeout')) {
      console.error(`Navigation or element wait timed out after ${timeout}ms.`);
      vscode.window.showErrorMessage(
        `The page or element took too long to load. Please check your network connection or increase the timeout.`
      );
    } else {
      console.error(`Failed to navigate or find element: ${error}`);
      vscode.window.showErrorMessage(`Failed to navigate or find element: ${error}`);
    }
    throw error;
  }
}