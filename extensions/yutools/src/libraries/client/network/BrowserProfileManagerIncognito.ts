import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { chromeProfileToGmail } from './chromeProfileToGmail';
import { shortNameToURL } from './shortNameToURL';

interface ProfileMapping {
	[key: string]: string;
}

interface URLMapping {
	[key: string]: string;
}

interface FirefoxProfile {
	name: string;
	path: string;
}

class BrowserProfileManagerIncognito {
	private chromeProfilesPath: string;
	private firefoxProfilesPath: string;
	private profileToGmail: ProfileMapping;
	private shortToURL: URLMapping;
	private firefoxProfiles: FirefoxProfile[];

	private static instance: BrowserProfileManagerIncognito;

	public static getInstance(): BrowserProfileManagerIncognito {
		if (!BrowserProfileManagerIncognito.instance) {
			BrowserProfileManagerIncognito.instance = new BrowserProfileManagerIncognito();
		}
		return BrowserProfileManagerIncognito.instance;
	}

	private constructor() {
		this.chromeProfilesPath = path.join(
			process.env.LOCALAPPDATA || '',
			'Google',
			'Chrome',
			'User Data'
		);

		// C:\Users\usef\work\sidoarjo>cat %appdata%\mozilla\firefox\profiles.ini
		// [Profile18]
		// Name=uneh.saraswati
		// IsRelative=1
		// Path=Profiles/njxuuc1e.uneh.saraswati
		this.firefoxProfilesPath = path.join(
			process.env.APPDATA || '',
			'Mozilla',
			'Firefox',
			'profiles.ini'
		);

		this.profileToGmail = chromeProfileToGmail;
		this.shortToURL = shortNameToURL;
		this.firefoxProfiles = this.loadFirefoxProfiles();
	}

	private loadFirefoxProfiles(): FirefoxProfile[] {
		if (!fs.existsSync(this.firefoxProfilesPath)) {
			throw new Error('Firefox profiles.ini file not found.');
		}

		const iniContent = fs.readFileSync(this.firefoxProfilesPath, 'utf-8');
		const profiles: FirefoxProfile[] = [];

		let currentProfile: FirefoxProfile = { name: '', path: '' };
		iniContent.split(/\r?\n/).forEach((line) => {
			if (line.startsWith('[Profile')) {
				if (currentProfile.name && currentProfile.path) {
					profiles.push(currentProfile);
				}
				currentProfile = { name: '', path: '' };
			} else if (line.startsWith('Name=')) {
				currentProfile.name = line.split('=')[1];
			} else if (line.startsWith('Path=')) {
				currentProfile.path = line.split('=')[1];
			}
		});

		// Add the last profile if it exists
		if (currentProfile.name && currentProfile.path) {
			profiles.push(currentProfile);
		}

		return profiles;
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
					(entry.name.startsWith('Profile') || entry.name.startsWith('Default'))
			)
			.map((entry) => {
				const gmail = this.profileToGmail[entry.name] || 'Unknown Gmail Account';
				return `${entry.name} (${gmail})`;
			});

		return profiles;
	}

	// listFirefoxProfiles(): string[] {
	// 	if (!fs.existsSync(this.firefoxProfilesPath)) {
	// 		throw new Error('Firefox profiles.ini file not found.');
	// 	}

	// 	const iniContent = fs.readFileSync(this.firefoxProfilesPath, 'utf-8');
	// 	const profiles: string[] = [];

	// 	iniContent.split(/\r?\n/).forEach((line) => {
	// 		if (line.startsWith('Name=')) {
	// 			profiles.push(line.split('=')[1]);
	// 		}
	// 	});

	// 	return profiles;
	// }
  listFirefoxProfiles(): string[] {
    return this.firefoxProfiles.map((profile) => profile.name);
  }

  getFirefoxProfilePath(profileName: string): string {
    const profile = this.firefoxProfiles.find((p) => p.name === profileName);
    if (!profile) {
      throw new Error(`Firefox profile '${profileName}' not found.`);
    }
    return profile.path;
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
		urls: string | string[],
		privateMode: boolean = false
	): void {
		// Ensure URLs are in an array
		const urlList = Array.isArray(urls) ? urls : [urls];

		// Resolve all URLs
		const resolvedURLs = urlList.map((url) => this.resolveURL(url));

		// Build the command
		let command: string;
		if (browser === 'chrome') {
			command = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --user-data-dir="${this.chromeProfilesPath}" --profile-directory="${profile}"`;
			if (privateMode) {
				command += ' --incognito';
			}
			command += ` ${resolvedURLs.join(' ')}`;
		} else if (browser === 'firefox') {
			command = `"C:\\Program Files\\Mozilla Firefox\\firefox.exe" -no-remote -P "${profile}"`;
			if (privateMode) {
				command += ' --private-window';
			}
			command += ` ${resolvedURLs.join(' ')}`;
		} else {
			throw new Error(`Unsupported browser: ${browser}`);
		}

		console.log(
			`Launching ${browser} with profile: ${profile}, private mode: ${privateMode}, and URLs: ${resolvedURLs.join(
				', '
			)}`
		);

		exec(command, (error) => {
			if (error) {
				console.error(`Error launching ${browser}:`, error.message);
			}
		});
	}
}

export default BrowserProfileManagerIncognito;

// const browserManager = new BrowserProfileManagerIncognito();

// // Open Chrome in private mode with multiple URLs
// browserManager.launchBrowser(
// 	'chrome',
// 	'Profile 1',
// 	['https://github.com/login', 'https://railway.com/new', 'https://api.together.xyz/signin'],
// 	true
// );

// // Open Firefox in normal mode with a single URL
// browserManager.launchBrowser(
// 	'firefox',
// 	'default',
// 	'https://github.com/login'
// );