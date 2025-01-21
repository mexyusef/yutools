import { BrowserClient, login } from '..';
import * as vscode from 'vscode';
import { setClient } from './clientManager';

export async function loginBolt() {
  const client = new BrowserClient('chromium');
  await client.launch({ 
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false 
  });
  // Set the client for later use
  setClient(client);
  try {
    await login(
      client,
      'https://lovable.dev/login',
      'your-email',
      'your-password',
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