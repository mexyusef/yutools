import * as vscode from 'vscode';
import BrowserProfileManagerIncognito from '../BrowserProfileManagerIncognito';

const browserManager = BrowserProfileManagerIncognito.getInstance();

export const openBrowserWithProfileSelectionCommand = vscode.commands.registerCommand('yutools.browsers.openBrowserWithProfileSelection',

  async (args: {
    browser: 'chrome' | 'firefox';
    profile: string;
    urls: string | string[];
    privateMode?: boolean;
  }) => {
    try {
      // Destructure the args
      const { browser, profile, urls, privateMode } = args;

      // Validate the browser
      if (browser !== 'chrome' && browser !== 'firefox') {
        throw new Error(`Invalid browser: ${browser}. Must be 'chrome' or 'firefox'.`);
      }

      // Validate the profile
      const profiles = browser === 'chrome' ? browserManager.listChromeProfiles() : browserManager.listFirefoxProfiles();
      const profileExists = profiles.some((p) => p.startsWith(profile));
      if (!profileExists) {
        throw new Error(`Profile '${profile}' does not exist for browser '${browser}'.`);
      }

      // Use the profile name as-is (do not split for Chrome)
      const profileName = profile; // Remove the splitting logic

      // Validate the URLs
      const urlList = Array.isArray(urls) ? urls : [urls];
      if (urlList.length === 0) {
        throw new Error('At least one URL must be provided.');
      }

      // Launch the browser
      browserManager.launchBrowser(
        browser,
        profileName,
        urlList,
        privateMode || false
      );

      vscode.window.showInformationMessage(
        `Opening ${browser} with profile: ${profileName} and URLs: ${urlList.join(', ')}`
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to open browser: ${error.message}`);
    }
  }
);

export const openBrowserWithProfileCommand = vscode.commands.registerCommand('yutools.browsers.openBrowserWithProfile',
  async (args: {
    // browser: 'chrome' | 'firefox';
    // profile: string;
    urls: string | string[];
    privateMode?: boolean;
  }) => {

    const { urls, privateMode } = args;

    try {
      // Prompt for browser selection
      const browser = await vscode.window.showQuickPick(['chrome', 'firefox'], {
        placeHolder: 'Select a browser',
      });
      if (!browser) {
        return;
      }

      // Prompt for profile selection
      const profiles = browser === 'chrome' ? browserManager.listChromeProfiles() : browserManager.listFirefoxProfiles();
      const profile = await vscode.window.showQuickPick(profiles, {
        placeHolder: 'Select a profile',
      });
      if (!profile) {
        return;
      }

      // Extract the profile name (remove the Gmail account part for Chrome)
      const profileName = browser === 'chrome' ? profile.split(' ')[0] : profile;

      // // Prompt for URLs
      // const urlsInput = await vscode.window.showInputBox({
      //   placeHolder: 'Enter URLs (comma-separated)',
      //   prompt: 'e.g., https://github.com/login,https://railway.com/new',
      // });
      // if (!urlsInput) {
      //   return;
      // }

      // const urls = urlsInput.split(',').map((url) => url.trim());

      // // Prompt for private mode
      // const privateMode = await vscode.window.showQuickPick(['Yes', 'No'], {
      //   placeHolder: 'Open in private/incognito mode?',
      // });
      const urlList = Array.isArray(urls) ? urls : [urls];
      if (urlList.length === 0) {
        throw new Error('At least one URL must be provided.');
      }

      // Launch the browser
      browserManager.launchBrowser(
        browser as 'chrome' | 'firefox',
        profileName,
        // urls,
        urlList,
        privateMode || false
        // privateMode === 'Yes'
      );

      vscode.window.showInformationMessage(`Opening ${browser} with profile: ${profileName}`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to open browser: ${error.message}`);
    }
  });

// export function activate(context: vscode.ExtensionContext) {
// 	// Command 1: List all profiles of Chrome and Firefox and insert into the active editor
// 	// Command 2: Open a browser with a profile and URLs
// 	// Add the commands to the extension's subscriptions
// 	context.subscriptions.push(listProfilesCommand, openBrowserWithProfileCommand);
// }
