import * as vscode from 'vscode';
import { waitForSelector } from '../../actions/waitForSelector';
import { type } from '../../actions/type';
import { click } from '../../actions/click';
import { screenshot } from '../../actions/screenshot';
import { getClient } from '../clientManager';
import { ACCOUNT_GITHUB } from '../../accounts/constants';
import { getAccountFromQuickPick } from '../../accounts/getAccountFromQuickPick';

// <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none bg-muted callout hover:bg-primary/20 border border-zinc-700 h-7 rounded-md px-2 py-1 gap-1.5" type="button" id="radix-:r3g:" aria-haspopup="menu" aria-expanded="false" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" class="shrink-0 h-5 w-5 text-muted-foreground" fill="currentColor"><path d="m166-482 176 176q9 9 8.5 21t-9.5 21-21.5 9-21.5-9L101-461q-5-5-7-10t-2-11 2-11 7-10l200-200q9-9 21.5-9t21.5 9 9 21.5-9 21.5zm628 0L618-658q-9-9-8.5-21t9.5-21 21.5-9 21.5 9l197 197q5 5 7 10t2 11-2 11-7 10L659-261q-9 9-21 8.5t-21-9.5-9-21.5 9-21.5z"></path></svg><span class="hidden md:flex">Edit code</span></button>

export async function handleGitHubAuth() {
  const client = getClient();

  try {
    // Click the "Edit code" button
    // await click(client, '#radix-\\:r46\\:'); // Escape the colon in the ID, but id changes => r46, r3g, etc.
    await click(client, 'button:has-text("Edit code")');
    console.log('Edit code button clicked.');

    // Wait for the GitHub auth page to load
    await waitForSelector(client, '#login_field', 10_000); // Username/email input field
    console.log('GitHub auth page loaded.');

    const account = await getAccountFromQuickPick(ACCOUNT_GITHUB);
    if (!account) return;
    const { username, password } = account;

    await type(client, '#login_field', username);
    await type(client, '#password', password);
    await click(client, 'input[name="commit"]'); // Click the "Sign in" button
    console.log('GitHub auth form submitted.');

    vscode.window.showInformationMessage('GitHub auth handled successfully!');
  } catch (error) {
    await screenshot(client, 'c:\\hapus\\gagal_lovable_github_auth_screenshot.png');
    vscode.window.showErrorMessage(`GitHub auth failed: ${error}`);
  }
}