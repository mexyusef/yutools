import { BrowserClient, navigate, screenshot } from '..';
import * as vscode from 'vscode';
import * as path from 'path';
import { setClient } from './clientManager';

export async function screenshotNYTimes() {
  const client = new BrowserClient('chromium');
  await client.launch({ 
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false
  });
  setClient(client);
  try {
    await navigate(client, 'https://www.nytimes.com');

    // const screenshotPath = path.join(__dirname, '..', '..', 'nytimes_screenshot.png');
    const screenshotPath = path.join('c:\\hapus', 'nytimes_screenshot.png');
    await screenshot(client, screenshotPath);

    // // Take a screenshot of a specific element (e.g., the headline)
    // await screenshot(client, 'nytimes_headline.png', 'h1');

    vscode.window.showInformationMessage(`Screenshot saved to: ${screenshotPath}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to capture screenshot: ${error}`);
  // } finally {
  //   await client.close();
  }
}