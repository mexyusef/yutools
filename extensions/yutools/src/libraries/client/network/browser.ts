import * as vscode from 'vscode';
import * as fs from 'fs';
import BrowserProfileManager from './browserProfileManager';
import { visitURLCommand } from './visitURLCommand';
import { listBrowserProfilesCommand } from './commands/listBrowserProfiles';
import { openBrowserWithProfileCommand } from './commands/openBrowserWithProfile';

const profileManager = new BrowserProfileManager();
const urlsFilePath = 'C:\\Users\\usef\\ai-chats.json';

async function getURLs(): Promise<{ label: string; url: string }[]> {
	let urls: { label: string; url: string }[] = [];

	if (fs.existsSync(urlsFilePath)) {
		const fileContent = fs.readFileSync(urlsFilePath, 'utf-8');
		urls = JSON.parse(fileContent);
	}

	urls.push({ label: '__INPUT__', url: '' });
	return urls;
}

const visitChromeURLCommand = vscode.commands.registerCommand('yutools.visitChromeURL',
	async () => {
		try {
			// Step 1: List Chrome profiles
			const profiles = profileManager.listChromeProfiles();

			const profile = await vscode.window.showQuickPick(profiles, {
				placeHolder: 'Select a Chrome profile',
			});
			if (!profile) return;

			// Extract profile name (e.g., Default, Profile 1)
			const profileName = profile.split('(')[0].trim();

			// Step 2: Select or input a URL
			const urls = await getURLs();
			const urlSelection = await vscode.window.showQuickPick(
				urls.map((u) => u.label),
				{
					placeHolder: 'Select a URL or choose __INPUT__ to enter manually',
				}
			);
			if (!urlSelection) return;

			let url = urls.find((u) => u.label === urlSelection)?.url;
			if (urlSelection === '__INPUT__') {
				url = await vscode.window.showInputBox({
					placeHolder: 'Enter the URL to visit',
				});
			}
			if (!url) return;

			// Step 3: Launch Chrome
			profileManager.launchBrowser('chrome', profileName, url);
			vscode.window.showInformationMessage(`Launched Chrome with profile ${profileName} at ${url}`);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
		}
	}
);

const visitFirefoxURLCommand = vscode.commands.registerCommand('yutools.visitFirefoxURL',
	async () => {
		try {
			// Step 1: List Firefox profiles
			const profiles = profileManager.listFirefoxProfiles();

			const profile = await vscode.window.showQuickPick(profiles, {
				placeHolder: 'Select a Firefox profile',
			});
			if (!profile) return;

			// Extract profile name (e.g., Default, Profile 1)
			const profileName = profile.split('(')[0].trim();

			// Step 2: Select or input a URL
			const urls = await getURLs();
			const urlSelection = await vscode.window.showQuickPick(
				urls.map((u) => u.label),
				{
					placeHolder: 'Select a URL or choose __INPUT__ to enter manually',
				}
			);
			if (!urlSelection) return;

			let url = urls.find((u) => u.label === urlSelection)?.url;
			if (urlSelection === '__INPUT__') {
				url = await vscode.window.showInputBox({
					placeHolder: 'Enter the URL to visit',
				});
			}
			if (!url) return;

			// Step 3: Launch Firefox
			profileManager.launchBrowser('firefox', profileName, url);
			vscode.window.showInformationMessage(`Launched Firefox with profile ${profileName} at ${url}`);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
		}
	}
);

const visitChromeWithPlaywrightCommand = vscode.commands.registerCommand('yutools.visitChromeWithPlaywright',
	async () => {
			try {
					// Step 1: List Chrome profiles
					const profiles = profileManager.listChromeProfiles();

					const profile = await vscode.window.showQuickPick(profiles, {
							placeHolder: 'Select a Chrome profile',
					});
					if (!profile) return;

					// Extract profile name (e.g., Default, Profile 1)
					const profileName = profile.split('(')[0].trim();
					console.log(`Selected profile name: ${profileName}`);
					// Step 2: Select or input a URL
					const urls = await getURLs();
					const urlSelection = await vscode.window.showQuickPick(
							urls.map((u) => u.label),
							{
									placeHolder: 'Select a URL or choose __INPUT__ to enter manually',
							}
					);
					if (!urlSelection) return;

					let url = urls.find((u) => u.label === urlSelection)?.url;
					if (urlSelection === '__INPUT__') {
							url = await vscode.window.showInputBox({
									placeHolder: 'Enter the URL to visit',
							});
					}
					if (!url) return;

					// Step 3: Launch Chrome with Playwright
					await profileManager.launchBrowserWithPlaywright('chrome', profileName, url);
					vscode.window.showInformationMessage(`Launched Chrome with profile ${profileName} at ${url} using Playwright`);
			} catch (error: any) {
					vscode.window.showErrorMessage(`Error: ${error.message}`);
			}
	}
);

const visitFirefoxWithPlaywrightCommand = vscode.commands.registerCommand('yutools.visitFirefoxWithPlaywright',
	async () => {
			try {
					// Step 1: List Firefox profiles
					const profiles = profileManager.listFirefoxProfiles();

					const profile = await vscode.window.showQuickPick(profiles, {
							placeHolder: 'Select a Firefox profile',
					});
					if (!profile) return;

					// Extract profile name (e.g., Default, Profile 1)
					const profileName = profile.split('(')[0].trim();

					// Step 2: Select or input a URL
					const urls = await getURLs();
					const urlSelection = await vscode.window.showQuickPick(
							urls.map((u) => u.label),
							{
									placeHolder: 'Select a URL or choose __INPUT__ to enter manually',
							}
					);
					if (!urlSelection) return;

					let url = urls.find((u) => u.label === urlSelection)?.url;
					if (urlSelection === '__INPUT__') {
							url = await vscode.window.showInputBox({
									placeHolder: 'Enter the URL to visit',
							});
					}
					if (!url) return;

					// Step 3: Launch Firefox with Playwright
					await profileManager.launchBrowserWithPlaywright('firefox', profileName, url);
					vscode.window.showInformationMessage(`Launched Firefox with profile ${profileName} at ${url} using Playwright`);
			} catch (error: any) {
					vscode.window.showErrorMessage(`Error: ${error.message}`);
			}
	}
);

export function register_browser_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(visitChromeURLCommand, visitFirefoxURLCommand);
	context.subscriptions.push(visitURLCommand);
	context.subscriptions.push(visitChromeWithPlaywrightCommand);
	context.subscriptions.push(visitFirefoxWithPlaywrightCommand);
	context.subscriptions.push(openBrowserWithProfileCommand);
	context.subscriptions.push(listBrowserProfilesCommand);
}
