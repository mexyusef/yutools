import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { chromium, firefox } from 'playwright';
import { chromeProfileToGmail } from './chromeProfileToGmail';
import { shortNameToURL } from './shortNameToURL';

interface ProfileMapping {
	[key: string]: string;
}

interface URLMapping {
	[key: string]: string;
}

// Explicitly set the Chrome executable path and args
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

class BrowserProfileManager {
	private chromeProfilesPath: string;
	private firefoxProfilesPath: string;
	private profileToGmail: ProfileMapping;
	private shortToURL: URLMapping;

	constructor() {
		this.chromeProfilesPath = path.join(
			process.env.LOCALAPPDATA || '',
			'Google',
			'Chrome',
			'User Data'
		);
		this.firefoxProfilesPath = path.join(
			process.env.APPDATA || '',
			'Mozilla',
			'Firefox',
			'profiles.ini'
		);

		this.profileToGmail = chromeProfileToGmail;

		this.shortToURL = shortNameToURL;
	}

	listChromeProfiles(): string[] {
		if (!fs.existsSync(this.chromeProfilesPath)) {
			throw new Error('Chrome user data directory not found.');
		}

		const profiles = fs
			.readdirSync(this.chromeProfilesPath, { withFileTypes: true })
			.filter(
				(entry) =>
					entry.isDirectory() &&
					// (entry.name.startsWith('Profile') || entry.name === 'Default')
					(entry.name.startsWith('Profile') || entry.name.startsWith('Default'))
			)
			.map((entry) => {
				const gmail = this.profileToGmail[entry.name] || 'Unknown Gmail Account';
				return `${entry.name} (${gmail})`;
			});

		return profiles;
	}

	listFirefoxProfiles(): string[] {
		if (!fs.existsSync(this.firefoxProfilesPath)) {
			throw new Error('Firefox profiles.ini file not found.');
		}

		const iniContent = fs.readFileSync(this.firefoxProfilesPath, 'utf-8');
		const profiles: string[] = [];

		iniContent.split(/\r?\n/).forEach((line) => {
			if (line.startsWith('Name=')) {
				profiles.push(line.split('=')[1]);
			}
		});

		return profiles;
	}

	resolveURL(shortCode: string): string {
		if (shortCode.startsWith('http://') || shortCode.startsWith('https://')) {
			return shortCode;
		}

		const url = this.shortToURL[shortCode];
		if (!url) {
			throw new Error(`Unknown short URL: ${shortCode}`);
		}

		return url;
	}

	launchBrowser(
		browser: 'chrome' | 'firefox',
		profile: string,
		url: string
	): void {
		const resolvedURL = this.resolveURL(url);
		const command =
			browser === 'chrome'
				? `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --user-data-dir="${this.chromeProfilesPath}" --profile-directory="${profile}" ${resolvedURL}`
				: `"C:\\Program Files\\Mozilla Firefox\\firefox.exe" -no-remote -P "${profile}" ${resolvedURL}`;

		console.log(`Launching ${browser} with profile: ${profile} and URL: ${resolvedURL}`);

		exec(command, (error) => {
			if (error) {
				console.error(`Error launching ${browser}:`, error.message);
			}
		});
	}

	async launchBrowserWithPlaywright(
		browser: 'chrome' | 'firefox',
		profile: string,
		url: string
	): Promise<void> {
		const resolvedURL = this.resolveURL(url);

		if (browser === 'chrome') {
			// Construct the full path to the profile directory
			const userDataDir = path.join(this.chromeProfilesPath, profile);

			// Check if the profile directory exists
			if (!fs.existsSync(userDataDir)) {
				throw new Error(`Chrome profile directory not found: ${userDataDir}`);
			}

			console.log(`Launching Chrome with profile: ${profile}, userDataDir: ${userDataDir}, URL: ${resolvedURL}`);

			// Explicitly set the Chrome executable path
			// const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

			// Use launchPersistentContext with the full profile directory path
			const browserInstance = await chromium.launchPersistentContext(userDataDir, {
				headless: false,
				executablePath: chromePath, // Explicitly set the Chrome executable path
			});

			console.log(`Playwright launched Chrome with profile: ${profile}`);

			const page = await browserInstance.newPage();
			await page.goto(resolvedURL);

			console.log(`Navigated to URL: ${resolvedURL}`);
		} else if (browser === 'firefox') {
			const userDataDir = path.join(this.firefoxProfilesPath, profile);

			// Check if the profile directory exists
			if (!fs.existsSync(userDataDir)) {
				throw new Error(`Firefox profile directory not found: ${userDataDir}`);
			}

			console.log(`Launching Firefox with profile: ${profile}, userDataDir: ${userDataDir}, URL: ${resolvedURL}`);

			const browserInstance = await firefox.launchPersistentContext(userDataDir, {
				headless: false,
			});

			const page = await browserInstance.newPage();
			await page.goto(resolvedURL);
		} else {
			throw new Error(`Unsupported browser: ${browser}`);
		}
	}

	async launchBrowserWithPlaywright2(
		browser: 'chrome' | 'firefox',
		profile: string,
		url: string
	): Promise<void> {
		const resolvedURL = this.resolveURL(url);

		if (browser === 'chrome') {
			// const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
			const userDataDir = path.join(this.chromeProfilesPath, profile);

			const browserInstance = await chromium.launchPersistentContext(userDataDir, {
				headless: false,
				executablePath: chromePath,
			});

			console.log(`
				C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\client\\network\\browserProfileManager.ts
				launchBrowserWithPlaywright - FIREFOX
				browser = ${browser}
				profile = ${profile}
				userDataDir = ${userDataDir}
				url = ${url}
				resolvedURL = ${resolvedURL}
		`);

			const page = await browserInstance.newPage();
			await page.goto(resolvedURL);

		} else if (browser === 'firefox') {
			const profilesDir = path.join(process.env.APPDATA || '', 'Mozilla', 'Firefox');
			const profilesIniPath = path.join(profilesDir, 'profiles.ini');

			if (!fs.existsSync(profilesIniPath)) {
				throw new Error(`profiles.ini file not found at ${profilesIniPath}`);
			}

			// Parse profiles.ini and map names to paths
			const iniContent = fs.readFileSync(profilesIniPath, 'utf-8');
			const profiles: Record<string, string> = {};
			let currentProfile: { name: string | null; path: string | null } = { name: null, path: null };

			iniContent.split(/\r?\n/).forEach((line) => {
				if (line.startsWith('[Profile')) {
					if (currentProfile.name && currentProfile.path) {
						profiles[currentProfile.name] = currentProfile.path;
					}
					currentProfile = { name: null, path: null };
				} else if (line.startsWith('Name=')) {
					currentProfile.name = line.split('=')[1];
				} else if (line.startsWith('Path=')) {
					const relativePath = line.split('=')[1];
					currentProfile.path = path.isAbsolute(relativePath)
						? relativePath
						: path.join(profilesDir, relativePath);
				}
			});
			if (currentProfile.name && currentProfile.path) {
				profiles[currentProfile.name] = currentProfile.path;
			}

			// Match the selected profile to its directory
			const userDataDir = profiles[profile];
			if (!userDataDir) {
				throw new Error(`Profile "${profile}" not found in profiles.ini`);
			}

			const firefoxPath = 'C:\\Program Files\\Mozilla Firefox\\firefox.exe';

			const browserInstance = await firefox.launchPersistentContext(userDataDir, {
				headless: false,
				executablePath: firefoxPath,
			});

			// Ensure navigation happens after the context is initialized
			const page = browserInstance.pages().length
				? browserInstance.pages()[0]
				: await browserInstance.newPage();

			console.log(`
            C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\client\\network\\browserProfileManager.ts
            launchBrowserWithPlaywright - FIREFOX
            browser = ${browser}
            profile = ${profile}
            userDataDir = ${userDataDir}
            url = ${url}
            resolvedURL = ${resolvedURL}
        `);

			// Navigate to the resolved URL
			await page.goto(resolvedURL);

			// Keep the context alive until explicitly closed
			page.on('close', () => {
				console.log('Page closed.');
			});

			browserInstance.on('close', () => {
				console.log('Browser context closed.');
			});
		} else {
			throw new Error(`Unsupported browser: ${browser}`);
		}
	}

	async launchBrowserWithPlaywright3(
		browser: 'chrome' | 'firefox',
		profile: string,
		url: string
	): Promise<void> {
		const resolvedURL = this.resolveURL(url);

		if (browser === 'chrome') {
			const userDataDir = path.join(this.chromeProfilesPath, profile);
			if (!fs.existsSync(userDataDir)) {
				throw new Error(`Chrome profile directory not found: ${userDataDir}`);
			}
			const browserInstance = await chromium.launchPersistentContext(userDataDir, {
				headless: false,
				executablePath: chromePath, // Explicitly set the Chrome executable path
				// args: [
				// 	`--user-data-dir=${this.chromeProfilesPath}`, // Explicitly set the user data directory
				// 	`--profile-directory=${profile}` // Explicitly set the profile directory
				// ],
			});
			const profileName = profile.split('(')[0].trim();
			console.log(`
				C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\client\\network\\browserProfileManager.ts
				launchBrowserWithPlaywright - CHROME
				browser = ${browser}
				profile = ${profile}
				profileName = ${profileName}
				userDataDir = ${userDataDir}
				url = ${url}
				resolvedURL = ${resolvedURL}
			`);
			console.log(`Launching Chrome with profile: ${profileName}, userDataDir: ${userDataDir}, URL: ${resolvedURL}`);
			const page = await browserInstance.newPage();
			await page.goto(resolvedURL);

		} else if (browser === 'firefox') {
			const userDataDir = path.join(this.firefoxProfilesPath, profile);
			if (!fs.existsSync(userDataDir)) {
				throw new Error(`Chrome profile directory not found: ${userDataDir}`);
			}
			const browserInstance = await firefox.launchPersistentContext(userDataDir, {
				headless: false,
			});
			console.log(`
				C:\\ai\\yuagent\\extensions\\yutools\\src\\libraries\\client\\network\\browserProfileManager.ts
				launchBrowserWithPlaywright - FIREFOX
				browser = ${browser}
				profile = ${profile}
				userDataDir = ${userDataDir}
				url = ${url}
				resolvedURL = ${resolvedURL}
			`);
			const page = await browserInstance.newPage();
			await page.goto(resolvedURL);
		} else {
			throw new Error(`Unsupported browser: ${browser}`);
		}
	}

}

export default BrowserProfileManager;
