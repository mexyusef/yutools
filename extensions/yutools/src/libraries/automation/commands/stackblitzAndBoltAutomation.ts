import { BrowserClient } from '../core/BrowserClient';
import { navigate, type, click, waitForElement } from '..';
import * as vscode from 'vscode';
import { setClient } from './clientManager';

export async function stackblitzAndBoltAutomation() {
  const client = new BrowserClient('chromium');
  await client.launch({
    executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
    headless: false
  });
  setClient(client);
  try {
    // Step 1: Visit StackBlitz login page
    await navigate(client, 'https://stackblitz.com/sign_in');
    await waitForElement(client, 'form input[name="login"]', 60_000); // Wait for email input

    // // Step 2: Fill in the login form and submit
    // const email = await vscode.window.showInputBox({
    //   prompt: 'Enter your StackBlitz email or username',
    //   placeHolder: 'Email or Username',
    // });
    // if (!email) {
    //   vscode.window.showWarningMessage('No email entered. Exiting...');
    //   return;
    // }

    // const password = await vscode.window.showInputBox({
    //   prompt: 'Enter your StackBlitz password',
    //   placeHolder: 'Password',
    //   password: true, // Hide input for password
    // });
    // if (!password) {
    //   vscode.window.showWarningMessage('No password entered. Exiting...');
    //   return;
    // }
    const email = 'sample-username-here';
    const password = 'sample-password-here';

    await type(client, 'form input[name="login"]', email);
    await type(client, 'form input[name="password"]', password);
    await click(client, 'form button[type="submit"]');
    console.log(`telah login stackblitz...siap baca button bolt.new`);

    // // Wait for login to complete
    // // ini gagal
    // await waitForElement(client, 'body', 60_000);

    // // Step 3: Click the "bolt.new" link
    // await waitForElement(client, 'a._Link_snie7_154', 60_000); // Wait for the link
    // await click(client, 'a._Link_snie7_154');



    console.log(`pada page stackblitz dan nunggu muncul tombol bolt.new`);
    // Step 3: Wait for the "bolt.new" link to appear and be interactive
    // await client.waitForSelector('a._Link_snie7_154[href*="bolt.new"]', { visible: true });
    await client.waitForSelector('a._Link_snie7_154[href*="bolt.new"]');
    // await client.waitForFunction(() => {
    //   const link = document.querySelector('a._Link_snie7_154[href*="bolt.new"]');
    //   return link && link.offsetWidth > 0 && link.offsetHeight > 0;
    // });
    await client.waitForFunction(() => {
      const link = document.querySelector('a._Link_snie7_154[href*="bolt.new"]') as HTMLElement | null;
      return link && link.offsetWidth > 0 && link.offsetHeight > 0;
    });
    console.log(`pada page stackblitz dan siap pencet tombol bolt.new`);
    // Step 4: Click the "bolt.new" link
    await client.click('a._Link_snie7_154[href*="bolt.new"]');


    console.log(`nunggu page bolt.new loaded dan muncul Sign In button`);
    // Step 4: Wait for bolt.new page to load and ask for confirmation
    await waitForElement(client, 'button:has-text("Sign In")', 60_000); // Wait for Sign In button
    const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: 'Do you want to press the "Sign In" button on bolt.new?',
    });

    const bolt_text_area_placeholder = "How can Bolt help you today?";

    if (confirm === 'Yes') {
      await click(client, 'button:has-text("Sign In")');

      console.log(`pada page bolt.new dan sudah tekan button Sign In, tunggu muncul textarea`);
      // Step 5: Fill in the prompt textarea
      await waitForElement(client, `textarea[placeholder=${bolt_text_area_placeholder}]`, 60_000); // Wait for textarea

    // } else {
    //   vscode.window.showInformationMessage('Skipped pressing the "Sign In" button.');
    }

    const prompt = await vscode.window.showInputBox({
      prompt: 'Enter your prompt for Bolt',
      placeHolder: 'How can Bolt help you today?',
    });

    if (prompt) {
      await type(client, `textarea[placeholder=${bolt_text_area_placeholder}]`, prompt);
      vscode.window.showInformationMessage('Prompt submitted successfully!');
    } else {
      vscode.window.showWarningMessage('No prompt entered. Skipping...');
    }

  } catch (error) {
    vscode.window.showErrorMessage(`Automation failed: ${error}`);
  } finally {
    await client.close();
  }
}