import * as vscode from 'vscode';
import { navigate, type, click } from '../..';
import { getClientOrInit } from '../clientManager';
import { ACCOUNT_GITHUB } from '../../accounts/constants';
import { getAccountFromQuickPick } from '../../accounts/getAccountFromQuickPick';

// Masalah utama: menggunakan automation spt ini utk login bisa dimarked as spam...
export async function automateGitHubAndRailway() {
  const client = await getClientOrInit();
  try {

    // Step 2: Open GitHub login page
    const githubUrl = 'https://github.com/login';
    await navigate(client, githubUrl);

    // Step 3: Select a GitHub account using Quick Pick
    const account = await getAccountFromQuickPick(ACCOUNT_GITHUB);
    if (!account) {
      vscode.window.showErrorMessage('No account selected. Exiting...');
      return;
    }

    const { username, password } = account;

    // Step 4: Fill in the GitHub login form
    const usernameSelector = '#login_field';
    const passwordSelector = '#password';
    // const submitSelector = 'input[type="submit"]';

    await type(client, usernameSelector, username);
    await type(client, passwordSelector, password);

    // // Step 5: Submit the login form
    // await click(client, submitSelector);

    // Step 6: Open Railway in a new tab
    const railwayUrl = 'https://railway.com/new';
    const page = client.page!;
    const newPage = await page.context().newPage();
    await newPage.goto(railwayUrl);

    vscode.window.showInformationMessage('GitHub login and Railway page opened successfully.');
  } catch (error) {
    vscode.window.showErrorMessage(`Automation failed: ${error}`);
  }
}

// Register the command in your extension
export function registerGitHubAndRailwayCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('yutools.browserAutomation.railway.couldBeMarkedAsSpam.automateGitHubAndRailway', async () => {
    await automateGitHubAndRailway();
  });

  context.subscriptions.push(disposable);
}