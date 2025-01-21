import * as vscode from 'vscode';
// import * as fs from 'fs';
// import { exec } from 'child_process';
// import * as path from 'path';

import BrowserProfileManager from './browserProfileManager';

const profileManager = new BrowserProfileManager();

export const visitURLCommand = vscode.commands.registerCommand('yutools.visitURL',
	async (args: { browser: 'chrome' | 'firefox', profile: string, url: string }) => {
		try {
			const { browser, profile, url } = args;

			if (!browser || !profile || !url) {
				vscode.window.showErrorMessage('Missing required arguments: browser, profile, or url.');
				return;
			}

			// Step 1: Validate the profile
			const profiles = browser === 'chrome' ? profileManager.listChromeProfiles() : profileManager.listFirefoxProfiles();
			const profileExists = profiles.some(p => p.startsWith(profile));

			if (!profileExists) {
				vscode.window.showErrorMessage(`Profile "${profile}" not found for ${browser}.`);
				return;
			}

			// Step 2: Launch the browser
			profileManager.launchBrowser(browser, profile, url);
			vscode.window.showInformationMessage(`Launched ${browser} with profile ${profile} at ${url}`);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
		}
	}
);

// vscode.commands.executeCommand('yutools.visitURL', {
// 	browser: 'chrome',
// 	profile: 'Default',
// 	url: 'https://google.com'
// });
