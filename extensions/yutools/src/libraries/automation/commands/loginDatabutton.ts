import { BrowserClient} from '../core/BrowserClient';
import { navigate, type, click } from '..';
import * as vscode from 'vscode';
import { getEmailFromQuickPick } from '../accounts/getEmailFromQuickPick';
import { ACCOUNT_DATABUTTON } from '../accounts/constants';
import { setClient } from './clientManager';

export async function loginDatabuttonAndOpenGmail() {
  const client = new BrowserClient('chromium');
  await client.launch({
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false 
  });
  setClient(client);
  try {
    // // Prompt the user for their email
    // const email = await vscode.window.showInputBox({
    //   prompt: 'Enter your email for Databutton login',
    //   placeHolder: 'mail@example.com',
    // });

    // // If the user cancels the input box, exit the function
    // if (!email) {
    //   vscode.window.showWarningMessage('No email entered. Exiting...');
    //   return;
    // }
    const email = await getEmailFromQuickPick(ACCOUNT_DATABUTTON);
    if (!email) return;

    // Navigate to the Databutton login page
    await navigate(client, 'https://databutton.com/login?next=/home');

    // Wait for the login form to load
    await client.waitForSelector('form input[type="email"]', 50000);

    // Fill in the email input field
    await type(client, 'form input[type="email"]', email);

    // Click the "Sign In or Up" button
    await click(client, 'form button[type="submit"]');

    // // Wait for the login process to complete (adjust timeout as needed)
    // await client.waitForSelector('body', 50000);
    // // Open Gmail in the same browser
    // await navigate(client, 'https://mail.google.com/mail/u/0/#inbox');

    vscode.window.showInformationMessage('Logged in to Databutton successfully!');
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to log in or open Gmail: ${error}`);
  // } finally {
  //   await client.close();
  }
}