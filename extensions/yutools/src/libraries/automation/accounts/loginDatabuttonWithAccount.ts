import * as vscode from 'vscode';
import { BrowserClient, navigate, type, click } from '..';
import { getEmailFromQuickPick } from './getEmailFromQuickPick';
import { ACCOUNT_DATABUTTON } from './constants';

export async function loginDatabutton() {
  const client = new BrowserClient('chromium');
  await client.launch({
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false,
  });

  try {
    const email = await getEmailFromQuickPick(ACCOUNT_DATABUTTON);
    if (!email) return;

    await navigate(client, 'https://databutton.com/login?next=/home');

    // Wait for the login form to load
    await client.waitForSelector('form input[type="email"]', 50000);

    // Fill in the email input field
    await type(client, 'form input[type="email"]', email);

    // Click the "Sign In or Up" button
    await click(client, 'form button[type="submit"]');

    vscode.window.showInformationMessage('Login to Databutton completed!');
  } catch (error) {
    vscode.window.showErrorMessage(`Login to Databutton failed: ${error}`);
  }
}