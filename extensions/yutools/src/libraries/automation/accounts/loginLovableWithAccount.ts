import * as vscode from 'vscode';
import { BrowserClient, login } from '..';
import { getAccountFromQuickPick } from './getAccountFromQuickPick';
import { ACCOUNT_LOVABLE } from './constants';

export async function loginLovable() {
  const client = new BrowserClient('chromium');
  await client.launch({
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false,
  });

  try {
    const account = await getAccountFromQuickPick(ACCOUNT_LOVABLE);
    if (!account) return;

    await login(
      client,
      'https://lovable.dev/login',
      account.username,
      account.password,
      {
        emailSelector: '#email',
        passwordSelector: '#password',
        submitSelector: 'form button:has-text("Sign in")',
      }
    );
    vscode.window.showInformationMessage('Login to MyWebsite completed!');
  } catch (error) {
    vscode.window.showErrorMessage(`Login to MyWebsite failed: ${error}`);
  }
}