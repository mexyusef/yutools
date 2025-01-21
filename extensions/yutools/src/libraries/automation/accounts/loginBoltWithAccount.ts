import { BrowserClient, login } from '..';
import * as vscode from 'vscode';
import { getAccountFromQuickPick } from './getAccountFromQuickPick';
import { ACCOUNT_BOLT } from './constants';

export async function loginBolt() {
  const client = new BrowserClient('chromium');
  await client.launch({
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false,
  });

  try {
    const account = await getAccountFromQuickPick(ACCOUNT_BOLT);
    if (!account) return;

    await login(
      client,
      'https://bolt.com/login',
      account.username,
      account.password,
      {
        emailSelector: '#email',
        passwordSelector: '#password',
        submitSelector: 'form button:has-text("Sign in")',
      }
    );
    vscode.window.showInformationMessage('Login to Bolt completed!');
  } catch (error) {
    vscode.window.showErrorMessage(`Login to Bolt failed: ${error}`);
  }
}