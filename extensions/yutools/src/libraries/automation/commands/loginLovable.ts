import { BrowserClient, login } from '..';
import * as vscode from 'vscode';
import { setClient } from './clientManager';
import { ACCOUNT_LOVABLE } from '../accounts/constants';
import { getAccountFromQuickPick } from '../accounts/getAccountFromQuickPick';

export async function loginLovable() {
  const client = new BrowserClient('chromium');
  await client.launch({ 
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false 
  });
  // Set the client for later use
  setClient(client);
  try {
    const account = await getAccountFromQuickPick(ACCOUNT_LOVABLE);
    if (!account) return;
    const { username: email, password } = account;

    await login(
      client,
      'https://lovable.dev/login',
      email,
      password,
      {
        emailSelector: '#email',
        passwordSelector: '#password',
        // submitSelector: 'button[type="submit"]',
        // submitSelector: 'button:has-text("Sign in")',
        submitSelector: 'form button:has-text("Sign in")',
      }
    );

    vscode.window.showInformationMessage('Login to MyWebsite completed!');
  } catch (error) {
    vscode.window.showErrorMessage(`Login to MyWebsite failed: ${error}`);
  // } finally {
  //   await client.close();
  }
}
// coba juga
// https://databutton.com/
// https://databutton.com/home
// deed_mossy283@simplelogin.com // binsar