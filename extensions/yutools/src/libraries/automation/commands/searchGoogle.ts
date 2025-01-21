import { BrowserClient, navigate, type, click, pressKey } from '..';
import * as vscode from 'vscode';
import { waitForSelector } from '../actions/waitForSelector';
import { setClient } from './clientManager';

export async function searchGoogle() {
  // Prompt the user for a search query
  const query = await vscode.window.showInputBox({
    prompt: 'Enter your Google search query',
    placeHolder: 'e.g., Playwright automation',
  });

  // If the user cancels the input box, exit the function
  if (!query) {
    vscode.window.showWarningMessage('No search query entered. Exiting...');
    return;
  }

  const client = new BrowserClient('chromium');
  await client.launch({
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false
  });
  setClient(client);
  try {
    await navigate(client, 'https://www.google.com');

    // await type(client,
    //   'input[name="q"]', // Failed to type into element: input[name="q"] google2: Timeout 5000ms exceeded.
    //   query
    // );
    // Wait for the search input field to be visible
    // await waitForSelector(client, 'textarea.gLFyf', { state: 'visible', timeout: 50000 });
    await waitForSelector(client, 'textarea.gLFyf', 60_000);
    // Type the query into the search input field
    await type(client, 'textarea.gLFyf', query);

    // await click(client, 'input[value="Google Search"]');
    // Wait for the Google Search button to be visible and click it
    // await waitForSelector(client, 'input[name="btnK"]', { state: 'visible', timeout: 50000 });
    // await waitForSelector(client, 'input[name="btnK"]', 60_000 );
    // await click(client, 'input[name="btnK"]');

    // // Wait for the Google Search button to be visible and click it
    // // Use a robust selector that doesn't rely on text or language-specific attributes
    // await waitForSelector(client, 'input[name="btnK"][type="submit"]', 60_000 );
    // await click(client, 'input[name="btnK"][type="submit"]');

    // Press the "Enter" key to submit the search
    await pressKey(client, 'textarea.gLFyf', 'Enter');

    vscode.window.showInformationMessage(`Google search for "${query}" completed!`);
  } catch (error) {
    vscode.window.showErrorMessage(`Google search failed: ${error}`);
  // } finally {
  //   await client.close();
  }
}