import * as vscode from 'vscode';
import { BrowserClient, navigate, type, click, login } from '..';
import { ACCOUNT_GITHUB } from './constants';
import { getAccountFromQuickPick } from './getAccountFromQuickPick';
import { getClientOrInit, setClient } from '../commands/clientManager';

export async function loginGithub() {
  // const client = new BrowserClient('chromium');
  // await client.launch({
  //   executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
  //   headless: false,
  // });
  // setClient(client);
  const client = await getClientOrInit();
  try {
    const account = await getAccountFromQuickPick(ACCOUNT_GITHUB);
    if (!account) return;

    await login(
      client,
      'https://github.com/login',
      account.username,
      account.password,
      {
        emailSelector: '#login_field',
        passwordSelector: '#password',
        submitSelector: 'input[name="commit"]',
      }
    );
    vscode.window.showInformationMessage('Login to GitHub completed!');
  } catch (error) {
    vscode.window.showErrorMessage(`Login to GitHub failed: ${error}`);
  }
}