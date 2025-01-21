import * as vscode from 'vscode';
// import { BrowserClient } from '../..';
import { navigate, click, waitForElement } from '../..';
import { loginGithub } from '../../accounts/loginGithubWithAccount';
import { getClientOrInit } from '../clientManager';

// Main function to automate Railway login
export async function automateRailwayLogin() {
  // const client = new BrowserClient('chromium');
  const client = await getClientOrInit();
  try {
    // Step 1: Launch the browser
    await client.launch();

    // Step 2: Log in to GitHub
    await loginGithub();

    // Step 3: Navigate to Railway login page
    const railwayUrl = 'https://railway.com/new';
    await navigate(client, railwayUrl);

    // Step 4: Wait for the "Login with GitHub" button
    const githubLoginButtonSelector = 'button:has-text("Login With GitHub")';
    await waitForElement(client, githubLoginButtonSelector, 30000); // Wait up to 30 seconds

    // Step 5: Click the "Login with GitHub" button
    await click(client, githubLoginButtonSelector);

    // Step 6: Handle the GitHub login prompt
    const confirmation = await vscode.window.showInformationMessage(
      'Do you want to log in to GitHub again?',
      { modal: true },
      'Yes', 'No'
    );

    if (confirmation === 'Yes') {
      // Log in to GitHub again
      await loginGithub();
    } else {
      vscode.window.showInformationMessage('Skipping GitHub login.');
    }

    // Step 7: Keep the browser open
    vscode.window.showInformationMessage('Railway login process completed. Browser remains open.');
  } catch (error) {
    vscode.window.showErrorMessage(`Railway login automation failed: ${error}`);
  }
}

// Register the command in your extension
export function registerRailwayLoginCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('yutools.browserAutomation.railway.automateRailwayLogin', async () => {
    await automateRailwayLogin();
  });

  context.subscriptions.push(disposable);
}