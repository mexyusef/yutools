import * as vscode from 'vscode';
import { BrowserClient } from '../..';
import { navigate, type, click, waitForElement } from '../../';
import { EMAIL_ACCOUNTS, PASSWORD } from './email_accounts';
import { generateUsername } from './generateUsername';

const signupUrl = 'https://github.com/signup';
const emailSelector = '#email';
const passwordSelector = '#password';
const usernameSelector = '#login';
const continueButtonSelector = 'button.js-octocaptcha-load-captcha';


// Main function to automate the signup process
export async function automateSignup(client: BrowserClient, email: string) {

  const username = await generateUsername('Singapore');
  // const username = generateUsername(email);

  try {
    // Step 1: Navigate to the signup page
    await navigate(client, signupUrl);

    // Step 2: Fill in the email field
    await type(client, emailSelector, email);

    // Step 3: Fill in the password field
    await type(client, passwordSelector, PASSWORD);

    // Step 4: Fill in the username field
    await type(client, usernameSelector, username);

    // Step 5: Wait for the "Continue" button to appear
    await waitForElement(client, continueButtonSelector, 30000); // Wait up to 30 seconds

    // Ask for confirmation before proceeding
    const confirmation = await vscode.window.showInformationMessage(
      'The "Continue" button is now visible. Do you want to proceed with the signup?',
      { modal: true },
      'Yes', 'No'
    );

    if (confirmation === 'Yes') {
      // Step 6: Click the "Continue" button
      await click(client, continueButtonSelector);
      vscode.window.showInformationMessage('Signup form submitted successfully!');
    } else {
      vscode.window.showInformationMessage('Signup process cancelled.');
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Signup automation failed: ${error}`);
  }
}

const automateGithubSignup = vscode.commands.registerCommand('yutools.browserAutomation.github.automateGithubSignup', async () => {
  // Step 1: Show Quick Pick to select an email
  const selectedEmail = await vscode.window.showQuickPick(EMAIL_ACCOUNTS, {
    placeHolder: 'Select an email account to use for signup',
  });

  if (!selectedEmail) {
    vscode.window.showErrorMessage('No email selected. Exiting...');
    return;
  }

  // Step 2: Launch the browser and start the automation
  const client = new BrowserClient('chromium');
  try {
    await client.launch();
    await automateSignup(client, selectedEmail);
  } catch (error) {
    vscode.window.showErrorMessage(`Error during signup automation: ${error}`);
  // } finally {
  //   await client.close();
  }
});

// Register the command in your extension
export function registerGithubSignupCommand(context: vscode.ExtensionContext) {
  context.subscriptions.push(automateGithubSignup);
}