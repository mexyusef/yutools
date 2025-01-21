/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { ICodeEditor, ContentWidgetPositionPreference, IContentWidget } from '../../../../../editor/browser/editorBrowser.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { createCSSRule } from '../../../../../base/browser/dom.js';
// import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
// import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IFileService, FileType } from '../../../../../platform/files/common/files.js';
import { URI } from '../../../../../base/common/uri.js';
// import { TerminalCommandId } from '../../../../../workbench/contrib/terminal/common/terminal.js';
import { ITerminalService } from '../../../../../workbench/contrib/terminal/browser/terminal.js';
// import {
// 	IEnvironmentService,
// 	INativeEnvironmentService
// } from '../../../../../platform/environment/common/environment.js';

interface ProfileMapping {
	[key: string]: string;
}

export class BrowserProfileWidget extends Disposable implements IContentWidget {
	private static readonly ID = 'editor.widget.BrowserProfileWidget';
	private domNode: HTMLElement;
	private editor: ICodeEditor;
	private isVisible: boolean = false;
	private comboBox!: HTMLSelectElement;
	private killButton: HTMLElement;
	private chromeProfilesPath: URI;
	private firefoxProfilesPath: URI;
	private profileToGmail: ProfileMapping;

	constructor(
		editor: ICodeEditor,
		// @ICommandService private readonly commandService: ICommandService,
		@INotificationService private readonly notificationService: INotificationService,
		@ITerminalService private readonly terminalService: ITerminalService,
		// @IInstantiationService private readonly instantiationService: IInstantiationService,
		// @IEnvironmentService private readonly environmentService: IEnvironmentService,
		// @INativeEnvironmentService private readonly nativeEnvironmentService: INativeEnvironmentService,
		@IFileService private readonly fileService: IFileService
	) {
		super();

		this.editor = editor;

		// // Define paths for Chrome and Firefox profiles
		// this.chromeProfilesPath = URI.file(
		// 	`${process.env.LOCALAPPDATA || ''}/Google/Chrome/User Data`
		// );
		// this.firefoxProfilesPath = URI.file(
		// 	`${process.env.APPDATA || ''}/Mozilla/Firefox/profiles.ini`
		// );
		// // Define paths for Chrome and Firefox profiles using IEnvironmentService
		// this.chromeProfilesPath = URI.file(
		// 	`${this.environmentService.userDataPath}/Google/Chrome/User Data`
		// );
		// this.firefoxProfilesPath = URI.file(
		// 	`${this.environmentService.appSettingsHome}/Mozilla/Firefox/profiles.ini`
		// );
		// Define paths for Chrome and Firefox profiles using INativeEnvironmentService

		// const lokasi_chrome = `${this.nativeEnvironmentService.appRoot}/Google/Chrome/User Data`;
		const lokasi_chrome = 'C:\\Users\\usef\\AppData\\Local\\Google\\Chrome\\User Data';
		// const lokasi_firefox = `${this.nativeEnvironmentService.appRoot}/Mozilla/Firefox/profiles.ini`;
		const lokasi_firefox = 'C:\\Users\\usef\\AppData\\Roaming\\Mozilla\\Firefox\\profiles.ini';

		this.chromeProfilesPath = URI.file(lokasi_chrome);
		this.firefoxProfilesPath = URI.file(lokasi_firefox);
		console.log(`

			lokasi_chrome = ${lokasi_chrome}
			lokasi_firefox = ${lokasi_firefox}

		`);

		// Mapping of profiles to Gmail accounts
		this.profileToGmail = {
			'Default': 'Default',
			// 'Default (lara@gmail.com)': 'lara@gmail.com',
			'Profile 1': 'hayya@gmail.com',
			'Profile 3': 'ulumus/khalid@gmail.com',
			'Profile 4': 'elonmusk@gmail.com',
			'Profile 7': 'binsar@gmail.com',
			'Profile 8': 'yusef314@gmail.com',
			'Profile 10': 'viraljts@gmail.com',
			'Profile 11': 'usef.ulum@gmail.com',
			'Profile 12': 'jyw@gmail.com',
			'Profile 13': 'ukseiya@gmail.com',
			'Profile 14': 'user14@gmail.com',
			'Profile 15': 'tarfahmiz@gmail.com',
			'Profile 16': 'raymond@gmail.com',
			// "Profile 2": "user2@gmail.com",
			// "Profile 5": "user5@gmail.com",
			// "Profile 6": "user6@gmail.com",
			// "Profile 9": "user9@gmail.com",

		};

		this.createStyles();
		this.domNode = document.createElement('div');
		this.domNode.className = 'browser-profile-widget';

		this.createComboBox();
		////////////////////////////////////////////////////////
		// this.createKillButton();
		this.killButton = document.createElement('button');
		this.killButton.innerText = '❌Close';
		this.killButton.style.backgroundColor = '#ff4444'; // Red shade
		this.killButton.style.color = '#ffffff'; // White text
		this.killButton.style.border = 'none';
		this.killButton.style.padding = '5px 10px';
		this.killButton.style.cursor = 'pointer';
		this.killButton.style.marginLeft = '10px'; // Add some margin
		this.killButton.addEventListener('mouseover', () => {
			this.killButton.style.backgroundColor = '#cc0000'; // Darker red on hover
		});
		this.killButton.addEventListener('mouseout', () => {
			this.killButton.style.backgroundColor = '#ff4444'; // Restore original color
		});
		this.killButton.addEventListener('click', () => {
			// this.dispose(); // Kill the widget
			this.kill();
		});
		this.domNode.appendChild(this.killButton);
		////////////////////////////////////////////////////////
		this.createProfileButtons();
		// Add keydown event listener to handle Escape key
		this.domNode.addEventListener('keydown', (e) => this.handleKeyDown(e));
		this.editor.addContentWidget(this);
		this.hide();
	}

	private handleKeyDown(e: KeyboardEvent): void {
		if (e.key === 'Escape') {
			e.preventDefault();
			this.editor.focus();
			this.kill();
		}
	}

	private createStyles(): void {
		createCSSRule(`.browser-profile-widget`, `
			background-color: rgba(0, 0, 0, 0.8);
			border: 1px solid rgba(255, 255, 255, 0.2);
			padding: 10px;
			border-radius: 10px;
			backdrop-filter: blur(10px);
			box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
			display: block;
			overflow-y: auto; /* Add scrollbar */
			max-height: 400px; /* Fixed height */
			min-width: 400px;
	`);

		createCSSRule(`.browser-profile-widget select`, `
			width: 100%;
			padding: 5px;
			border: 1px solid rgba(255, 255, 255, 0.2);
			background-color: rgba(0, 0, 0, 0.5);
			color: white;
			border-radius: 5px;
			margin-bottom: 10px;
	`);

		createCSSRule(`.browser-profile-widget button`, `
			padding: 8px 16px;
			border: none;
			border-radius: 5px;
			background: linear-gradient(135deg, #00ff88, #00bfff);
			color: white;
			cursor: pointer;
			margin: 5px;
			transition: transform 0.2s ease, box-shadow 0.2s ease;
	`);

		createCSSRule(`.browser-profile-widget button:hover`, `
			transform: scale(1.05);
			box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
	`);
	}

	// private createComboBox(): void {
	private async createComboBox(): Promise<void> {
		this.comboBox = document.createElement('select');
		// const urls = [
		// 	{ label: 'DeepSeek', value: 'https://chat.deepseek.com' },
		// 	{ label: 'ChatGPT', value: 'https://chatgpt.com' },
		// 	{ label: 'Google', value: 'https://google.com' },
		// 	{ label: 'Gmail', value: 'https://gmail.com' },
		// 	{ label: 'Claude', value: 'https://claude.ai' },
		// 	{ label: 'Custom URL', value: '__INPUT__' },
		// ];
		const urls = await this.getURLs();
		urls.forEach(url => {
			const option = document.createElement('option');
			// option.value = url.value;
			option.value = url.url;
			option.textContent = url.label;
			this.comboBox.appendChild(option);
		});

		this.domNode.appendChild(this.comboBox);
	}

	private async getURLs(): Promise<{ label: string; url: string }[]> {
		const urlsFilePath = URI.file('C:\\Users\\usef\\ai-chats.json');
		let urls: { label: string; url: string }[] = [];

		try {
			// Read the file using IFileService
			const fileContent = await this.fileService.readFile(urlsFilePath);
			urls = JSON.parse(fileContent.value.toString());
		} catch (error) {
			this.notificationService.error('Failed to read the URLs file.');
		}

		// Add the custom URL option
		urls.push({ label: 'Custom URL', url: '__INPUT__' });
		return urls;
	}

	private async createProfileButtons(): Promise<void> {
		const chromeProfiles = await this.listChromeProfiles();
		const firefoxProfiles = await this.listFirefoxProfiles();

		const chromeContainer = document.createElement('div');
		chromeContainer.style.marginBottom = '10px';
		// chromeProfiles.forEach(profile => {
		// 	const button = document.createElement('button');
		// 	button.textContent = `Chrome: ${profile}`;
		// 	button.addEventListener('click', () => this.launchBrowser('chrome', profile));
		// 	chromeContainer.appendChild(button);
		// });
		chromeProfiles.forEach(({ displayName, folderName }) => {
			const button = document.createElement('button');
			button.textContent = `Chrome: ${displayName}`;
			button.dataset.folderName = folderName; // Store the actual folder name in a data attribute
			button.addEventListener('click', () => this.launchBrowser('chrome', folderName)); // Pass the actual folder name
			chromeContainer.appendChild(button);
		});

		const firefoxContainer = document.createElement('div');
		firefoxProfiles.forEach(profile => {
			const button = document.createElement('button');
			button.textContent = `Firefox: ${profile}`;
			button.addEventListener('click', () => this.launchBrowser('firefox', profile));
			firefoxContainer.appendChild(button);
		});

		this.domNode.appendChild(chromeContainer);
		this.domNode.appendChild(firefoxContainer);
	}

	// private async listChromeProfiles(): Promise<string[]> {
	// 	try {
	// 		// // Use IFileService.readdir to list directory contents
	// 		// const entries: [string, FileType][] = await this.fileService.readdir(this.chromeProfilesPath);
	// 		// C:\ai\yuagent\src\vs\platform\files\common\files.ts
	// 		// fahmiz https://chat.deepseek.com/a/chat/s/5fdca2f1-cf3d-4112-bcd2-10af6b3dd7f8
	// 		const provider = this.fileService.getProvider(this.chromeProfilesPath.scheme);
	// 		if (!provider) {
	// 			throw new Error(`No file system provider found for scheme: ${this.chromeProfilesPath.scheme}`);
	// 		}
	// 		const entries: [string, FileType][] = await provider.readdir(this.chromeProfilesPath);

	// 		// Filter and map entries
	// 		const profiles = entries
	// 			.filter(
	// 				([name, type]: [string, FileType]) => type === FileType.Directory
	// 					// && (name.startsWith('Profile') || name === 'Default')
	// 					&& (name.startsWith('Profile') || name.startsWith('Default'))
	// 			)
	// 			.map(([name]: [string, FileType]) => {
	// 				const gmail = this.profileToGmail[name] || 'Unknown Gmail Account';
	// 				return `${name} (${gmail})`;
	// 			});

	// 		return profiles;
	// 	} catch (error) {
	// 		this.notificationService.error('Chrome user data directory not found.');
	// 		throw new Error('Chrome user data directory not found.');
	// 	}
	// }

	private async listChromeProfiles(): Promise<{ displayName: string; folderName: string }[]> {
		try {
			const provider = this.fileService.getProvider(this.chromeProfilesPath.scheme);
			if (!provider) {
				throw new Error(`No file system provider found for scheme: ${this.chromeProfilesPath.scheme}`);
			}
			const entries: [string, FileType][] = await provider.readdir(this.chromeProfilesPath);
			const profiles = entries
				.filter(
					([name, type]: [string, FileType]) => type === FileType.Directory
						&& (name.startsWith('Profile') || name.startsWith('Default'))
				)
				.map(([name]: [string, FileType]) => {
					const gmail = this.profileToGmail[name] || 'Unknown Gmail Account';
					return {
						displayName: `${name} (${gmail})`, // Human-readable name
						folderName: name // Actual folder name
					};
				});

			return profiles;
		} catch (error) {
			this.notificationService.error('Chrome user data directory not found.');
			throw new Error('Chrome user data directory not found.');
		}
	}

	private async listFirefoxProfiles(): Promise<string[]> {
		try {
			const iniContent = (await this.fileService.readFile(this.firefoxProfilesPath)).value.toString();
			const profiles: string[] = [];

			iniContent.split(/\r?\n/).forEach(line => {
				if (line.startsWith('Name=')) {
					profiles.push(line.split('=')[1]);
				}
			});

			return profiles;
		} catch (error) {
			this.notificationService.error('Firefox profiles.ini file not found.');
			throw new Error('Firefox profiles.ini file not found.');
		}
	}

	private async launchBrowser(browser: 'chrome' | 'firefox', profile: string) {
		const selectedUrl = this.comboBox.value === '__INPUT__'
			? prompt('Enter the URL to visit:')
			: this.comboBox.value;

		if (!selectedUrl) return;

		// Construct the command to execute
		const command =
			browser === 'chrome'
				? `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --user-data-dir="${this.chromeProfilesPath.fsPath}" --profile-directory="${profile}" ${selectedUrl}`
				: `"C:\\Program Files\\Mozilla Firefox\\firefox.exe" -no-remote -P "${profile}" ${selectedUrl}`;
		console.log(`perintah: ${command}...`);
		// c:\Users\usef\AppData\Local\Google\Chrome\User Data
		// 12/29/2024  03:37 AM    <DIR>          Default
		// 12/29/2024  03:37 AM    <DIR>          Default (lara@gmail.com)
		// 12/28/2024  06:51 AM    <DIR>          Profile 1
		// 12/29/2024  03:23 AM    <DIR>          Profile 1 (hayya@gmail.com)
		// 12/29/2024  03:32 AM    <DIR>          Profile 10
		// 12/24/2024  08:49 PM    <DIR>          Profile 11
		// 12/29/2024  03:24 AM    <DIR>          Profile 11 (Unknown Gmail Account)
		// 12/28/2024  11:35 PM    <DIR>          Profile 12
		// 12/27/2024  02:08 AM    <DIR>          Profile 13
		// 12/29/2024  03:32 AM    <DIR>          Profile 15
		// 12/29/2024  03:23 AM    <DIR>          Profile 15 (Unknown Gmail Account)
		// 12/28/2024  06:52 AM    <DIR>          Profile 16
		// 12/29/2024  03:32 AM    <DIR>          Profile 3
		// 12/29/2024  03:32 AM    <DIR>          Profile 4
		// 12/06/2024  03:32 PM    <DIR>          Profile 6
		// 12/28/2024  06:46 AM    <DIR>          Profile 7
		// 12/29/2024  03:27 AM    <DIR>          Profile 8
		// "perintah: "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="c:\Users\usef\AppData\Local\Google\Chrome\User Data" --profile-directory="Default (lara@gmail.com)" https://chatgpt.com..."
		// Use ICommandService to execute the command
		// this.commandService.executeCommand('workbench.action.terminal.runCommand', command)
		// Use ICommandService to execute the custom command
		// this.commandService.executeCommand(LAUNCH_BROWSER_COMMAND_ID, browser, profile, selectedUrl)
		// Use the SendSequence command to send the command to the terminal
		// this.commandService.executeCommand(TerminalCommandId.SendSequence, command + '\r')
		// 	.then(() => {
		// 		console.log(`Launched ${browser} with profile: ${profile} and URL: ${selectedUrl}`);
		// 	})
		// 	.catch((error) => {
		// 		this.notificationService.error(`Error launching ${browser}: ${error.message}`);
		// 	});
		// Use ITerminalService to execute the command
		// C:\ai\yuagent\src\vs\workbench\contrib\terminal\browser\terminal.ts
		const terminal = await this.terminalService.createTerminal({ config: { name: 'Browser Launcher' } });
		terminal.sendText(command, true); // true to execute the command immediately
		// terminal.show();
		terminal.setVisible(true);
		terminal.focus();
	}

	public getId(): string {
		return BrowserProfileWidget.ID;
	}

	public getDomNode(): HTMLElement {
		return this.domNode;
	}

	public getPosition(): { position: Position; preference: ContentWidgetPositionPreference[] } | null {
		const position = this.editor.getPosition();
		return position ? {
			position: position,
			preference: [ContentWidgetPositionPreference.BELOW]
		} : null;
	}

	public show(): void {
		this.isVisible = true;
		this.domNode.style.display = 'block';
		this.editor.layoutContentWidget(this);
	}

	public hide(): void {
		this.isVisible = false;
		this.domNode.style.display = 'none';
		this.editor.layoutContentWidget(this);
	}

	public toggle(): void {
		if (this.isVisible) {
			this.hide();
		} else {
			this.show();
		}
	}

	public override dispose(): void {
		this.hide();
		this.editor.removeContentWidget(this);
		super.dispose();
	}

	public kill(): void {
		this.dispose();
	}

}
