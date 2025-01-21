import { BrowserClient } from '../core/BrowserClient';
import { navigate, type, click, waitForElement } from '..';
import * as vscode from 'vscode';
import { ACCOUNT_BOLT } from '../accounts/constants';
import { getAccountFromQuickPick } from '../accounts/getAccountFromQuickPick';
import { setClient } from './clientManager';

export async function stackblitzAndBoltAutomationTry2() {
  const client = new BrowserClient('chromium');
  await client.launch({
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false
  });
  setClient(client);
  try {
    await navigate(client, 'https://stackblitz.com/sign_in');
    await waitForElement(client, 'form input[name="login"]', 60_000);

    const account = await getAccountFromQuickPick(ACCOUNT_BOLT);
    if (!account) return;
    const { username: email, password } = account;

    await type(client, 'form input[name="login"]', email);
    await type(client, 'form input[name="password"]', password);
    await click(client, 'form button[type="submit"]');
    console.log(`Logged into StackBlitz. Waiting for the "bolt.new" button...`);

    // Wait for the "bolt.new" link to appear and be interactive
    await client.waitForSelector('a._Link_snie7_154[href*="bolt.new"]');
    await client.waitForFunction(() => {
      const link = document.querySelector('a._Link_snie7_154[href*="bolt.new"]') as HTMLElement | null;
      return link && link.offsetWidth > 0 && link.offsetHeight > 0;
    });
    console.log(`"bolt.new" button is ready. Clicking it...`);

    // Click the "bolt.new" link and capture the new page
    const [newPage] = await Promise.all([
      client.page!.waitForEvent('popup'), // Wait for the new tab/window to open
      client.click('a._Link_snie7_154[href*="bolt.new"]'), // Click the link
    ]);

    console.log(`Switched to the new Bolt page. Waiting for the "Sign In" button...`);

    // Switch the client context to the new page
    client.page = newPage;

    // Wait for the "Sign In" button on the new page
    await waitForElement(client, 'button:has-text("Sign In")', 60_000);

    const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: 'Do you want to press the "Sign In" button on bolt.new?',
    });

    const bolt_text_area_placeholder = "How can Bolt help you today?";

    if (confirm === 'Yes') {
      await click(client, 'button:has-text("Sign In")');
      console.log(`Clicked the "Sign In" button. Waiting for the textarea...`);

      // Wait for the textarea on the new page
      await waitForElement(client, `textarea[placeholder="${bolt_text_area_placeholder}"]`, 60_000);
    }

    // const prompt = await vscode.window.showInputBox({
    //   prompt: 'Enter your prompt for Bolt',
    //   placeHolder: 'How can Bolt help you today?',
    // });

    // if (prompt) {
    //   await type(client, `textarea[placeholder="${bolt_text_area_placeholder}"]`, prompt);
    //   vscode.window.showInformationMessage('Prompt submitted successfully!');
    // } else {
    //   vscode.window.showWarningMessage('No prompt entered. Skipping...');
    // }

  } catch (error) {
    vscode.window.showErrorMessage(`Automation failed: ${error}`);
  // } finally {
  //   await client.close();
  }
}
// <div class="relative select-none">
//   <textarea class="w-full pl-4 pt-4 pr-16 focus:outline-none resize-none text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent text-sm" placeholder="How can Bolt help you today?" translate="no" style="min-height: 76px; max-height: 200px; height: 76px; overflow-y: hidden;">create very cool nextjs 14 app</textarea>
//   <button class="absolute flex justify-center items-center top-[18px] right-[22px] p-1 bg-accent-500 hover:brightness-94 color-white rounded-md w-[34px] h-[34px] transition-theme disabled:cursor-not-allowed" style="opacity: 1; transform: none;">
//     <div class="text-lg">
//       <div class="i-ph:arrow-right"></div>
//     </div>
//   </button>
// </div>
