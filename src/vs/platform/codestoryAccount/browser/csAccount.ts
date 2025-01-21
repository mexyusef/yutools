/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from "../../../base/browser/dom.js";
// import { Button } from '../../../base/browser/ui/button/button.js';
// import { Codicon } from '../../../base/common/codicons.js';
// import { ThemeIcon } from '../../../base/common/themables.js';
// import { defaultButtonStyles } from '../../theme/browser/defaultStyles.js';
import { Disposable } from "../../../base/common/lifecycle.js";
import {
	IContextKey,
	IContextKeyService,
} from "../../contextkey/common/contextkey.js";
// import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ILayoutService } from "../../layout/browser/layoutService.js";
import { INotificationService } from "../../notification/common/notification.js";
import {
	IStorageService,
	StorageScope,
	StorageTarget,
} from "../../storage/common/storage.js";
import {
	CSAuthenticationSession,
	ICSAccountService,
	ICSAuthenticationService,
} from "../common/csAccount.js";
import { CS_ACCOUNT_CARD_VISIBLE } from "../common/csAccountContextKeys.js";
import "./media/csAccount.css";
import { ICommandService } from "../../commands/common/commands.js";
import { IOpenerService } from "../../opener/common/opener.js";
import { URI } from "../../../base/common/uri.js";
import { IConfigurationService } from "../../configuration/common/configuration.js";
// import * as cp from 'child_process';
// import { IEnvironmentService } from '../../environment/common/environment.js';
import { ITerminalService } from "../../../workbench/contrib/terminal/browser/terminal.js";
import { IRequestService } from "../../request/common/request.js";
import { IRequestOptions } from "../../../base/parts/request/common/request.js";
import {
	// CancellationToken,
	CancellationTokenSource,
} from "../../../base/common/cancellation.js";
import {
	VSBuffer,
	// VSBufferReadableStream
} from "../../../base/common/buffer.js";
import { IFileService } from "../../files/common/files.js";
import { parse } from "../../../base/common/json.js";
import { IFileDialogService } from "../../dialogs/common/dialogs.js";
import { ILogService } from "../../log/common/log.js";
import { ApiRequestHandler } from "./httputils.js";
// import { IEditorService } from '../../../workbench/services/editor/common/editorService.js';
// import { ITextFileService } from '../../../workbench/services/textfile/common/textfiles.js';
// import { ITextEditorModel } from '../../../editor/common/services/resolverService.js';
// import { getNextProvider } from './kunci.js';
// import { ICodeEditorService } from '../../../editor/browser/services/codeEditorService.js';
// import { FoldingController } from '../../../editor/contrib/folding/browser/folding.js';

const $ = dom.$;
const STORAGE_KEY = "csAccount.requestCount";

export class CSAccountService extends Disposable implements ICSAccountService {
	_serviceBrand: undefined;
	// private authenticatedSession: CSAuthenticationSession | undefined;
	private isVisible: IContextKey<boolean>;
	private csAccountCard: HTMLElement | undefined;
	private jsonFilePathForCombobox: string;
	private apiKeyFile: string;

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ICSAuthenticationService private readonly csAuthenticationService: ICSAuthenticationService,
		// @IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILayoutService private readonly layoutService: ILayoutService,
		@INotificationService private readonly notificationService: INotificationService,
		@IStorageService private readonly storageService: IStorageService,
		@ICommandService private readonly commandService: ICommandService,
		@IOpenerService private readonly openerService: IOpenerService,
		@ITerminalService private readonly terminalService: ITerminalService,
		@IRequestService private readonly requestService: IRequestService,
		@IFileService private readonly fileService: IFileService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@ILogService private readonly logService: ILogService,
		// @IEditorService private readonly editorService: IEditorService,
		// @ITextFileService private readonly textFileService: ITextFileService,
		// @IEnvironmentService private readonly environmentService: IEnvironmentService,
		// @IProcessService private readonly processService: IProcessService,
		@IConfigurationService
		private readonly configurationService: IConfigurationService
	) // @ICodeEditorService private readonly codeEditorService: ICodeEditorService,

	{
		super();
		this.isVisible = CS_ACCOUNT_CARD_VISIBLE.bindTo(this.contextKeyService);
		// this.refresh();
		this.jsonFilePathForCombobox =
			"c:/users/usef/combobox-website-options.json";
		this.apiKeyFile = "c:/users/usef/XAI_API_KEYS.txt";
	}

	getCurrentWorkingDirectory(): string | undefined {
		// const directoryPath = this.getCurrentWorkingDirectory();
		// if (directoryPath) {
		// 	console.log(`The current working directory is: ${directoryPath}`);
		// } else {
		// 	console.log(`The current working directory is not set.`);
		// }
		// Fetch the configuration value
		const configValue = this.configurationService.getValue<string>(
			"yutools.currentWorkingDirectory"
		);
		return configValue;
	}

	// async insertResponseToEditor(responseText: string): Promise<void> {
	// 	const editor = this.editorService.activeEditor;
	// 	if (editor && editor instanceof ITextEditorModel) {
	// 		// If there's an active editor, insert the response at the current cursor position
	// 		const editorInstance = editor as ITextEditorModel;
	// 		const model = editorInstance.getModel();
	// 		const position = editorInstance.getSelection().getPosition();
	// 		const range = new Range(
	// 			position.lineNumber,
	// 			position.column,
	// 			position.lineNumber,
	// 			position.column
	// 		);
	// 		const text = responseText;
	// 		await model.applyEdits([{ range, text }]);
	// 		// Optionally, move the cursor to the end of the inserted text
	// 		const newPosition = position.translate(0, text.length);
	// 		editorInstance.setSelection(new Selection(newPosition.lineNumber, newPosition.column));
	// 	} else {
	// 		// If there's no active editor, create a new untitled file (like Ctrl+N)
	// 		const newFileUri = URI.from({ scheme: 'untitled', path: '/new-file.txt' }); // Untitled URI
	// 		// Open the untitled file
	// 		const model = await this.textFileService.create(newFileUri);
	// 		await model.textBuffer.setValue(responseText);
	// 		// Optionally, open the new file in the editor
	// 		await this.editorService.openEditor({ resource: newFileUri });
	// 	}
	// }

	async runFmusAtCwd(text: string): Promise<void> {
		const result = await this.runFmusAtSpecificDir(
			text,
			this.getCurrentWorkingDirectory() as string
		);
		return result;
	}

	async runFmusAtSpecificDir(text: string, dir: string): Promise<void> {
		const apiUrl = `http://localhost:8000/run_fmus`;

		const requestData = {
			content: "fmuslang:" + text,
			meta: {
				metaWorkspacesFspath: [dir],
				metaWorkspacesPath: [dir],
				currentProjectFolder: dir,
				metaDocument: {
					fsPath: dir,
					filename: dir,
					path: dir,
					language: "javascript",
				},
			},
		};
		try {
			// // Constructing request options
			// const requestOptions = {
			// 	type: 'POST',
			// 	url: apiUrl,
			// 	data: JSON.stringify(requestData),
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
			// };
			// Making the request
			// const response = await this.requestService.request(requestOptions, undefined);
			// Making the request with a no-op CancellationToken
			// const response = await this.requestService.request(requestOptions, CancellationToken.None);
			const apiRequestHandler = new ApiRequestHandler(
				this.requestService,
				this.notificationService
			);
			const response = await apiRequestHandler.sendRequest(apiUrl, requestData);
			// C:\ai\aide\extensions\yutools\src\handlers\commands\editor.ts
			// C:\ai\aide\extensions\yutools\package.json
			const commandId = "yutools.editor_insert_text_at_cursor";
			await this.commandService.executeCommand(commandId, response);
		} catch (error) {
			this.logService.error(error); // Optional logging
			// vscode.window.showErrorMessage(`Error running FMUS: ${error.message}`);
			this.notificationService.error(`Error running FMUS: ${error.message}`);
		}
	}

	toggle(): void {
		if (!this.isVisible.get()) {
			this.show();
			this.isVisible.set(true);
		} else {
			this.hide();
			this.isVisible.set(false);
		}
	}

	async ensureAuthenticated(): Promise<boolean> {
		// // wieke: hapus
		// return true;
		// For first 5 calls, return true without authenticating
		const jumlah = 100;
		const count = this.storageService.getNumber(
			STORAGE_KEY,
			StorageScope.PROFILE,
			0
		);
		if (count < jumlah) {
			this.storageService.store(
				STORAGE_KEY,
				count + 1,
				StorageScope.PROFILE,
				StorageTarget.MACHINE
			);
			return true;
		}
		try {
			let csAuthSession = await this.csAuthenticationService.getSession();
			if (!csAuthSession) {
				// Notify the user that they need to authenticate
				this.notificationService.info(
					`You have used up your ${jumlah} free requests. Please log in for unlimited requests.`
				);
				// Show the account card
				this.toggle();
				// Wait for the user to authenticate
				csAuthSession = await new Promise<CSAuthenticationSession>(
					(resolve, reject) => {
						const disposable = this.csAuthenticationService.onDidAuthenticate(
							(session) => {
								if (session) {
									resolve(session);
								} else {
									reject(new Error("Authentication failed"));
								}
								disposable.dispose();
							}
						);
					}
				);
			}
			if ((csAuthSession?.waitlistPosition ?? 0) > 0) {
				this.csAuthenticationService.notifyWaitlistPosition(
					csAuthSession.waitlistPosition
				);
				return false; // User is on the waitlist
			}

			// Increment the usage count
			this.storageService.store(
				STORAGE_KEY,
				count + 1,
				StorageScope.PROFILE,
				StorageTarget.MACHINE
			);
			return true; // User is authenticated and not on the waitlist
		} catch (error) {
			// Handle any errors that occurred during the authentication
			console.error("Error during refresh:", error);
			this.notificationService.error(
				"An error occurred during the authentication process. Please try again later."
			);
			return false; // Authentication failed
		}
	}

	async populateComboboxFromFile(
		// fileService: IFileService,
		// options: any[],
		container: HTMLElement
		// filePath: string
	) {
		const options = await this.readJsonFile(this.jsonFilePathForCombobox);
		// console.log(`baca json file hasilnya adlh:\n\n\n${JSON.stringify(options, null, 2)}\n\n`);
		const combobox = document.createElement("select");
		combobox.classList.add("glass-combobox");
		// Populate it with options from the file
		options.forEach((command: string) => {
			const opt = document.createElement("option");
			opt.value = command;
			opt.textContent = command;
			combobox.appendChild(opt);
		});
		// Append the combobox to the container
		container.appendChild(combobox);
		// Add a "Go" button
		const goButton = document.createElement("button");
		goButton.classList.add("neon-button");
		goButton.textContent = "Run";
		goButton.addEventListener("click", () => {
			const selectedCommand = combobox.value;
			this.sendToTerminal(selectedCommand);
		});
		container.appendChild(goButton);

		// tambah button utk reload json
		const jsonButton = document.createElement("button");
		jsonButton.classList.add("neon-button");
		jsonButton.textContent = "Select JSON";
		jsonButton.onclick = async () => {
			try {
				// Use IFileDialogService to open a file dialog
				const selectedUris = await this.fileDialogService.showOpenDialog({
					title: "Select a JSON File",
					canSelectMany: false,
					// filters: {
					// 	JSON: ['json'], // File filter for JSON files
					// },
					filters: [{ name: "JSON", extensions: ["json"] }],
				});

				if (!selectedUris || selectedUris.length === 0) {
					this.notificationService.error("No file selected.");
					return;
				}

				const selectedUri = selectedUris[0];

				// Read the JSON file using IFileService
				const fileContent = await this.fileService.readFile(selectedUri);
				// const selectedJsonFile = JSON.parse(fileContent.value.toString());

				// // Reload combobox with new data
				// const urlOptions = await this.readJsonFile(selectedJsonFile);
				const jsonString = fileContent.value.toString(); // Convert file content to string
				const parsedJson = JSON.parse(jsonString); // Parse JSON data
				// Reload combobox with new data
				while (combobox.firstChild) {
					combobox.removeChild(combobox.firstChild); // Clear existing options
				}
				if (Array.isArray(parsedJson)) {
					parsedJson.forEach((item) => {
						const opt = document.createElement("option");
						opt.value = item; // Set value to the string
						opt.textContent = item; // Use the string as the label
						combobox.appendChild(opt);
					});
				} else {
					this.notificationService.error(
						"Invalid JSON format. Expected an array of strings."
					);
				}
				this.notificationService.info(
					"JSON file loaded and combobox updated successfully."
				);
			} catch (error) {
				this.notificationService.error(
					`Error loading JSON file: ${error.message}`
				);
			}
		};
		container.appendChild(jsonButton);
	}

	processJsonData(parsedJson: any): any[] {
		// Validate and transform the JSON data into the expected format
		// Ensure parsedJson is an array or contains the necessary properties
		if (!Array.isArray(parsedJson)) {
			throw new Error("Invalid JSON format: Expected an array of objects.");
		}
		return parsedJson;
	}

	async readJsonFile(filePath: string): Promise<any[]> {
		const fileUri = URI.file(filePath);
		// console.log('fileService:', JSON.stringify(this.fileService), 'mau membaca:', filePath, 'atau URI:', JSON.stringify(fileUri));
		const content = await this.fileService.readFile(fileUri);
		const decoded = content.value.toString();
		return parse(decoded); // Parse the JSON
	}

	async readApiKeyFileAndGetKey(): Promise<string> {
		const fileUri = URI.file(this.apiKeyFile);
		const fileContent = await this.fileService.readFile(fileUri);
		const textContent = fileContent.value.toString();
		const keys = textContent.split("\n").filter((key) => key.trim() !== "");
		const randomIndex = Math.floor(Math.random() * keys.length);
		const randomKey = keys[randomIndex].trim();
		// console.log(`readApiKeyFileAndGetKey: using apiKey <<${randomKey}>>`);
		return randomKey;
	}

	private async show(): Promise<void> {
		const container = this.layoutService.activeContainer;
		// const csAccountCard =
		this.csAccountCard = dom.append(container, $(".cs-account-card"));
		// Create a scrollable container
		const scrollableContainer = dom.append(
			this.csAccountCard,
			$(".scrollable-container")
		);
		scrollableContainer.style.height = "80vh"; // Adjust to fit within your screen
		scrollableContainer.style.overflowY = "scroll";
		scrollableContainer.style.overflowX = "hidden"; // Prevent horizontal scroll
		scrollableContainer.style.padding = "10px";
		scrollableContainer.style.border = "1px solid rgba(255, 255, 255, 0.2)";
		scrollableContainer.style.borderRadius = "8px";
		scrollableContainer.style.background = "rgba(0, 0, 0, 0.6)";

		// Add control container inside the scrollable container
		const controlContainer = dom.append(
			scrollableContainer,
			$(".control-group")
		);
		controlContainer.style.display = "flex";
		controlContainer.style.flexDirection = "column";
		controlContainer.style.gap = "15px";

		// // Add neon toggle switch
		// const toggleContainer = document.createElement("div");
		// toggleContainer.classList.add("neon-toggle");
		// const toggle = document.createElement("input");
		// toggle.type = "checkbox";
		// toggle.id = "neonToggle";
		// const toggleLabel = document.createElement("label");
		// toggleLabel.htmlFor = "neonToggle";
		// toggleLabel.textContent = "Enable Feature";
		// toggleContainer.appendChild(toggle);
		// toggleContainer.appendChild(toggleLabel);
		// controlContainer.appendChild(toggleContainer);

		// Add a futuristic control panel
		const controlPanel = document.createElement("div");
		controlPanel.classList.add("custom-widget-control-panel");
		const buttons = [
			// https://microsoft.github.io/vscode-codicons/dist/codicon.html
			{ id: "btn1", active: false, icon: "add", tooltip: "Add Item", handler: () => console.log("Add clicked") },
			{ id: "btn2", active: false, icon: "edit", tooltip: "Edit Item", handler: () => console.log("Edit clicked") },
			{ id: "btn3", active: false, icon: "trash", tooltip: "Delete Item", handler: () => console.log("Delete clicked") },
			{ id: "btn4", active: false, icon: "save", tooltip: "Save Item", handler: () => console.log("Save clicked") },
			{ id: "btn5", active: false, icon: "search", tooltip: "Search Item", handler: () => console.log("Search clicked") },
			{ id: "btn6", active: false, icon: "refresh", tooltip: "Refresh Items", handler: () => console.log("Refresh clicked") },
			{ id: "btn7", active: false, icon: "settings", tooltip: "Settings", handler: () => console.log("Settings clicked") },
			{ id: "btn8", active: false, icon: "lock", tooltip: "Lock Panel", handler: () => console.log("Lock clicked") },
			{ id: "btn9", active: false, icon: "unlock", tooltip: "Unlock Panel", handler: () => console.log("Unlock clicked") },
			{ id: "btn10", active: false, icon: "play", tooltip: "Play Action", handler: () => console.log("Play clicked") },
			{ id: "btn11", active: false, icon: "stop-circle", tooltip: "Stop Action", handler: () => console.log("Stop clicked") },
			{ id: "btn12", active: false, icon: "cloud-upload", tooltip: "Upload File", handler: () => console.log("Upload clicked") },
			{ id: "btn13", active: false, icon: "cloud-download", tooltip: "Download File", handler: () => console.log("Download clicked") },
			{ id: "btn14", active: false, icon: "eye", tooltip: "View Details", handler: () => console.log("View clicked") },
			{ id: "btn15", active: false, icon: "copy", tooltip: "Copy Data", handler: () => console.log("Copy clicked") },
			{ id: "btn16", active: false, icon: "coffee", tooltip: "Paste Data", handler: () => console.log("Paste clicked") },
			{ id: "btn20", active: false, icon: "bell", tooltip: "Notifications", handler: () => console.log("Notifications clicked") },


			{ id: "btn22", active: true, icon: "file", tooltip: "g.exe: yude compile", handler: () => this.run_fmus_ketik("cd c:\\ai\\yuagent && npm run compile") },
			{ id: "btn23", active: true, icon: "tag", tooltip: "yude open extensions", handler: () => this.run_fmus_ketik("cd c:\\ai\\yuagent\\extensions && aide %cd%") },
			{ id: "btn24", active: true, icon: "key", tooltip: "g.exe: yutools bangun + bangun-web", handler: () => this.run_fmus_ketik("cd c:\\ai\\yuagent\\extensions\\yutools && bangun && bangun-web") },
			{ id: "btn25", active: true, icon: "terminal", tooltip: "g.exe: yutools bangun", handler: () => this.run_fmus_ketik("cd c:\\ai\\yuagent\\extensions\\yutools && bangun") },
			{ id: "btn21", active: true, icon: "folder", tooltip: "term: yutools bangun", handler: () => this.sendToTerminal("cd c:\\ai\\yuagent\\extensions\\yutools && bangun") },

			// { id: "btn17", active: false, icon: "export", tooltip: "Export Data", handler: () => this.commandService.executeCommand("workbench.action.toggleMaximizedPanel") },
			{ id: "btn17", active: true, icon: "split-horizontal", tooltip: "Max Panel", handler: () => this.commandService.executeCommand("workbench.action.toggleMaximizedPanel") },
			// { id: "btn18", active: false, icon: "download", tooltip: "Import Data", handler: () => this.commandService.executeCommand("workbench.action.gotoSymbol") },
			{ id: "btn18", active: true, icon: "symbol-class", tooltip: "Symbols", handler: () => this.commandService.executeCommand("workbench.action.gotoSymbol") },
			// { id: "btn19", active: false, icon: "sync", tooltip: "Synchronize", handler: () => this.commandService.executeCommand("editor.foldAll") },
			{ id: "btn19", active: true, icon: "fold", tooltip: "Fold All", handler: () => this.commandService.executeCommand("editor.foldAll") },
		];

		buttons.forEach(({ id, active, icon, tooltip, handler }) => {
			const button = document.createElement("button");
			button.id = id;
			button.classList.add("custom-widget-control-button");
			button.classList.add("custom-widget-control-button");
			if (active) {
				button.classList.add("active"); // Set initial active state
			}
			button.setAttribute("aria-label", tooltip);
			button.title = tooltip;

			const iconSpan = document.createElement("span");
			iconSpan.classList.add("custom-widget-codicon", "codicon", `codicon-${icon}`);
			button.appendChild(iconSpan);

			button.addEventListener("click", handler);
			controlPanel.appendChild(button);
		});
		controlContainer.appendChild(controlPanel);


		////////////////////////  START: ai chats
		const ai_urls_combobox = document.createElement("select");
		ai_urls_combobox.classList.add("glass-combobox");
		const ai_chats_file = "c:/users/usef/ai-chats.json";
		const urlOptions = await this.readJsonFile(ai_chats_file)
			.then((data) => {
				if (Array.isArray(data)) {
					return data.map((item) => ({
						label: item.label,
						url: item.url,
					}));
				} else {
					console.error(
						"Invalid JSON format. Expected an array of objects with `label` and `url`."
					);
					return [];
				}
			})
			.catch((err) => {
				console.error(`Error reading the JSON file: ${JSON.stringify(err)}. Membaca file ${ai_chats_file}`);
				return [];
			});

		urlOptions.forEach((option) => {
			const opt = document.createElement("option");
			opt.value = option.url;
			opt.textContent = option.label;
			ai_urls_combobox.appendChild(opt);
		});
		controlContainer.appendChild(ai_urls_combobox);

		// Add neon button
		const neonButton = document.createElement("button");
		neonButton.classList.add("neon-button");
		neonButton.textContent = "Go";
		neonButton.onclick = async () => {
			const selectedUrl = ai_urls_combobox.value;
			if (selectedUrl) {
				await this.openerService.open(URI.parse(selectedUrl));
				this.notificationService.info(`Opening URL: ${selectedUrl}`);
			} else {
				this.notificationService.error("No URL selected.");
			}
		};
		controlContainer.appendChild(neonButton);
		////////////////////////  END: ai chats

		// Add button group
		const buttonContainer = dom.append(scrollableContainer, $(".button-group"));
		buttonContainer.classList.add("button-container");
		const buttonConfigs = [
			{
				label: "Zen Mode",
				action: () =>
					this.commandService.executeCommand("workbench.action.toggleZenMode"),
			},
			{
				label: "Fullscreen",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.toggleFullScreen"
					),
			},

			{
				label: "gFMUS: dir",
				action: () => this.run_fmus_ketik("pwd && dir"),
			},
			{
				label: "gFMUS: f2.py",
				action: () => this.run_fmus_ketik("python c:\\work\\bin\\f2.py"),
			},
			{
				label: "TERM: f2.py",
				action: () => this.sendToTerminal("python c:\\work\\bin\\f2.py"),
			},
			{ label: "TERM: f2p", action: () => this.sendToTerminal("f2p") },

			{
				label: "🔘Toggle Panel",
				action: () =>
					this.commandService.executeCommand("workbench.action.togglePanel"),
			},
			{ label: "Primary🟪Bar", action: () => this.togglePrimarySidebar() },
			{ label: "Secondary🟢Bar", action: () => this.toggleSecondarySidebar() },
			{
				label: "Toggle Sidebar Position",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.toggleSidebarPosition"
					),
			},

			{
				label: "📟New Terminal",
				action: () =>
					this.commandService.executeCommand("workbench.action.terminal.new"),
			},
			{
				label: "📟Split Terminal",
				action: () =>
					this.commandService.executeCommand("workbench.action.terminal.split"),
			},
			{
				label: "📟Kill❌Terminal",
				action: () =>
					this.commandService.executeCommand("workbench.action.terminal.kill"),
			},
			{
				label: "📟System Terminal",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.terminal.openNativeConsole"
					),
			},

			{
				label: "✨New File",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.files.newUntitledFile"
					),
			},
			{
				label: "Quick Open File",
				action: () =>
					this.commandService.executeCommand("workbench.action.quickOpen"),
			},

			{
				label: "↪️Fold All",
				action: () => this.commandService.executeCommand("editor.foldAll"),
			},
			{
				label: "Unfold All",
				action: () => this.commandService.executeCommand("editor.unfoldAll"),
			},
			{
				label: "Toggle Word Wrap",
				action: () =>
					this.commandService.executeCommand("editor.action.toggleWordWrap"),
			},
			{
				label: "Go to Line",
				action: () =>
					this.commandService.executeCommand("workbench.action.gotoLine"),
			},
			{
				label: "Format Document",
				action: () =>
					this.commandService.executeCommand("editor.action.formatDocument"),
			},
			{
				label: "Format Selection",
				action: () =>
					this.commandService.executeCommand("editor.action.formatSelection"),
			},

			{
				label: "Sidebar Visibility",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.toggleSidebarVisibility"
					),
			},
			{
				label: "Settings",
				action: () =>
					this.commandService.executeCommand("workbench.action.openSettings"),
			},

			{
				label: "Key Shortcuts",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.openGlobalKeybindings"
					),
			},
			{
				label: "Command Palette",
				action: () =>
					this.commandService.executeCommand("workbench.action.showCommands"),
			},

			{
				label: "Reveal in Explorer",
				action: () => this.commandService.executeCommand("revealFileInOS"),
			},

			{
				label: "Open Recent",
				action: () =>
					this.commandService.executeCommand("workbench.action.openRecent"),
			},
			{
				label: "Search Files",
				action: () =>
					this.commandService.executeCommand("workbench.action.findInFiles"),
			},
			{
				label: "Close Editor",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.closeActiveEditor"
					),
			},
			{
				label: "Save All",
				action: () =>
					this.commandService.executeCommand("workbench.action.files.saveAll"),
			},
			{
				label: "🪣Stage Changes",
				action: () => this.commandService.executeCommand("git.stage"),
			},
			{
				label: "🪣Git Graph",
				action: () => this.commandService.executeCommand("git.showAllCommits"),
			},
			{
				label: "🪣Git Commit",
				action: () => this.commandService.executeCommand("git.commit"),
			},
			{
				label: "Open Git Repository",
				action: () =>
					this.commandService.executeCommand("workbench.action.openRepository"),
			},
			{
				label: "🪣Sync Changes",
				action: () => this.commandService.executeCommand("git.sync"),
			},
			{
				label: "🪣Checkout Branch",
				action: () => this.commandService.executeCommand("git.checkout"),
			},
			{
				label: "🪣Merge Branch",
				action: () => this.commandService.executeCommand("git.merge"),
			},

			{
				label: "Reload Window",
				action: () =>
					this.commandService.executeCommand("workbench.action.reloadWindow"),
			},
			{
				label: "Toggle Output",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.output.toggleOutput"
					),
			},
			{
				label: "Toggle Problems Panel",
				action: () =>
					this.commandService.executeCommand("workbench.actions.view.problems"),
			},
			{
				label: "Open Extensions",
				action: () =>
					this.commandService.executeCommand("workbench.view.extensions"),
			},
			{
				label: "Show❌⚠️",
				action: () =>
					this.commandService.executeCommand("editor.action.showHover"),
			},
			{
				label: "Collapse All Folders",
				action: () =>
					this.commandService.executeCommand(
						"workbench.files.action.collapseExplorerFolders"
					),
			},

			{
				label: "Select All Occurrences",
				action: () =>
					this.commandService.executeCommand("editor.action.selectHighlights"),
			},
			{
				label: "Move Line Up",
				action: () =>
					this.commandService.executeCommand("editor.action.moveLinesUpAction"),
			},
			{
				label: "Move Line Down",
				action: () =>
					this.commandService.executeCommand(
						"editor.action.moveLinesDownAction"
					),
			},
			{
				label: "Copy Line Up",
				action: () =>
					this.commandService.executeCommand("editor.action.copyLinesUpAction"),
			},
			{
				label: "Copy Line Down",
				action: () =>
					this.commandService.executeCommand(
						"editor.action.copyLinesDownAction"
					),
			},

			{
				label: "Open Workspace",
				action: () =>
					this.commandService.executeCommand("workbench.action.openWorkspace"),
			},
			{
				label: "Close Workspace",
				action: () =>
					this.commandService.executeCommand("workbench.action.closeFolder"),
			},
			{
				label: "Open File from Clipboard",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.files.openFileFromClipboard"
					),
			},
			{
				label: "Duplicate Active File",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.files.duplicateFile"
					),
			},

			{
				label: "Sync Settings",
				action: () =>
					this.commandService.executeCommand("workbench.action.syncSettings"),
			},
			{
				label: "Find Next Symbol",
				action: () =>
					this.commandService.executeCommand("editor.action.marker.next"),
			},
			{
				label: "Find Previous Symbol",
				action: () =>
					this.commandService.executeCommand("editor.action.marker.prev"),
			},
			{
				label: "Search Online",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.openDocumentationUrl"
					),
			},

			{
				label: "Zoom In",
				action: () =>
					this.commandService.executeCommand("workbench.action.zoomIn"),
			},
			{
				label: "Zoom Out",
				action: () =>
					this.commandService.executeCommand("workbench.action.zoomOut"),
			},
			{
				label: "Reset Zoom",
				action: () =>
					this.commandService.executeCommand("workbench.action.zoomReset"),
			},

			{
				label: "Toggle Activity Bar",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.toggleActivityBarVisibility"
					),
			},
			{
				label: "Toggle Centered Layout",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.toggleCenteredLayout"
					),
			},
			{
				label: "Navigate Back",
				action: () =>
					this.commandService.executeCommand("workbench.action.navigateBack"),
			},
			{
				label: "Navigate Forward",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.navigateForward"
					),
			},

			{
				label: "Show Release Notes",
				action: () =>
					this.commandService.executeCommand("update.showCurrentReleaseNotes"),
			},
			{
				label: "Run Build Task",
				action: () =>
					this.commandService.executeCommand("workbench.action.tasks.build"),
			},
			{
				label: "Run Test Task",
				action: () =>
					this.commandService.executeCommand("workbench.action.tasks.test"),
			},
			{
				label: "Show Running Tasks",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.tasks.showTasks"
					),
			},
			{
				label: "Terminate Task",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.tasks.terminate"
					),
			},

			{
				label: "Start Debugging",
				action: () =>
					this.commandService.executeCommand("workbench.action.debug.start"),
			},
			{
				label: "Toggle Breakpoint",
				action: () =>
					this.commandService.executeCommand(
						"editor.debug.action.toggleBreakpoint"
					),
			},
			{
				label: "Run Last Debug",
				action: () =>
					this.commandService.executeCommand("workbench.action.debug.run"),
			},
			{
				label: "Step Over",
				action: () =>
					this.commandService.executeCommand("workbench.action.debug.stepOver"),
			},
			{
				label: "Step Into",
				action: () =>
					this.commandService.executeCommand("workbench.action.debug.stepInto"),
			},
			{
				label: "Step Out",
				action: () =>
					this.commandService.executeCommand("workbench.action.debug.stepOut"),
			},
			{
				label: "Restart Debugging",
				action: () =>
					this.commandService.executeCommand("workbench.action.debug.restart"),
			},

			// { label: 'Open Markdown Preview', action: () => this.commandService.executeCommand('markdown.showPreview') },
			{
				label: "📜Open Preview",
				action: () =>
					this.commandService.executeCommand("markdown.showPreview"),
			},
			{
				label: "📜Open Preview to the Side",
				action: () =>
					this.commandService.executeCommand("markdown.showPreviewToSide"),
			},
			{
				label: "📜Toggle Preview Lock",
				action: () =>
					this.commandService.executeCommand("markdown.togglePreviewLock"),
			},
			{
				label: "📜Copy As HTML",
				action: () => this.commandService.executeCommand("markdown.export"),
			},
			{
				label: "📜Insert Table",
				action: () =>
					this.commandService.executeCommand(
						"markdown.extension.editing.insertTable"
					),
			},
			{
				label: "📜Toggle List",
				action: () =>
					this.commandService.executeCommand(
						"markdown.extension.editing.toggleList"
					),
			},
			{
				label: "📜Create Table of Contents",
				action: () =>
					this.commandService.executeCommand("markdown.extension.toc.create"),
			},
			{
				label: "📜Update Table of Contents",
				action: () =>
					this.commandService.executeCommand("markdown.extension.toc.update"),
			},
			{
				label: "📜Show Source",
				action: () =>
					this.commandService.executeCommand(
						"workbench.action.files.revealActiveFileInExplorer"
					),
			},
			{
				label: "📜Toggle Bold",
				action: () =>
					this.commandService.executeCommand(
						"markdown.extension.editing.toggleBold"
					),
			},
			{
				label: "📜Toggle Italic",
				action: () =>
					this.commandService.executeCommand(
						"markdown.extension.editing.toggleItalic"
					),
			},

			{
				label: "🔼",
				action: () =>
					this.commandService.executeCommand("yutools.glassit_increase"),
			},
			{
				label: "🔽",
				action: () =>
					this.commandService.executeCommand("yutools.glassit_decrease"),
			},
			{
				label: "⬜",
				action: () =>
					this.commandService.executeCommand("yutools.glassit_maximize"),
			},
			{
				label: "➖",
				action: () =>
					this.commandService.executeCommand("yutools.glassit_minimize"),
			},

			{
				label: "🖥️",
				action: () =>
					this.commandService.executeCommand(
						"yutools.terminal_command_serve_llm"
					),
			},

			{
				label: "🛑",
				action: () =>
					this.commandService.executeCommand("workbench.action.quit"),
			},
		];
		buttonConfigs.forEach((config) => {
			const button = document.createElement("button");
			button.classList.add("futuristic-button");
			button.textContent = config.label;
			button.addEventListener("click", config.action);
			buttonContainer.appendChild(button);
		});
		//////////////////////////////////////////////////
		this.populateComboboxFromFile(scrollableContainer);
		//////////////////////////////////////////////////
		// Add text area
		const textAreaContainer = dom.append(
			scrollableContainer,
			$(".text-area-container")
		);

		// Add futuristic slider
		const sliderContainer = document.createElement("div");
		sliderContainer.classList.add("futuristic-slider");
		const slider = document.createElement("input");
		slider.type = "range";
		// slider.min = '0';
		// slider.max = '100';
		// slider.value = '50';
		slider.min = "0";
		slider.max = "2";
		slider.step = "0.1";
		slider.value = "0.7"; // Default value for temperature
		slider.classList.add("gradient-slider");
		sliderContainer.appendChild(slider);
		// controlContainer.appendChild(sliderContainer);
		textAreaContainer.appendChild(sliderContainer);

		const textAreaLabel = document.createElement("label");
		textAreaLabel.textContent = "Query ";
		textAreaLabel.classList.add("futuristic-label");
		textAreaContainer.appendChild(textAreaLabel);

		// Display the current temperature value next to the slider (optional)
		const temperatureValueDisplay = document.createElement("span");
		temperatureValueDisplay.textContent = `Temperature: ${slider.value}`;
		// sliderContainer.appendChild(slider);
		textAreaContainer.appendChild(temperatureValueDisplay);
		let temperature = parseFloat(slider.value);
		// Update the temperature when the slider value changes
		slider.addEventListener("input", () => {
			temperature = parseFloat(slider.value);
			temperatureValueDisplay.textContent = `Temperature: ${temperature}`;
		});

		const textArea = document.createElement("textarea");
		textArea.classList.add("futuristic-textarea");
		textArea.placeholder = "Type something to query LLM or run fmus code...";
		textAreaContainer.appendChild(textArea);

		// Add Send button and second textarea for response
		const sendContainer = dom.append(scrollableContainer, $(".send-container"));
		sendContainer.style.display = "flex";
		sendContainer.style.flexDirection = "column";
		sendContainer.style.gap = "10px";

		// Second textarea for displaying server response
		const responseContainer = document.createElement("div");
		responseContainer.style.display = "none"; // Initially hidden
		responseContainer.style.flexDirection = "column";
		responseContainer.style.gap = "5px";
		const responseLabel = document.createElement("label");
		responseLabel.textContent = "Server Response";
		responseLabel.classList.add("futuristic-label");
		responseContainer.appendChild(responseLabel);

		const responseTextarea = document.createElement("textarea");
		responseTextarea.classList.add("futuristic-textarea");
		responseTextarea.readOnly = true;
		responseTextarea.placeholder = "Server response will appear here...";
		responseContainer.appendChild(responseTextarea);
		sendContainer.appendChild(responseContainer);

		// Send button
		const sendButton = document.createElement("button");
		sendButton.classList.add("neon-button", "send-button");
		sendButton.textContent = "Send";
		sendButton.onclick = async () => {
			const messageContent = textArea.value.trim();
			if (!messageContent) {
				this.notificationService.error(
					"Text area is empty. Please type something."
				);
				return;
			}
			const alamat = `https://api.x.ai/v1/chat/completions`;
			const apiKey = await this.readApiKeyFileAndGetKey();
			const options: IRequestOptions = {
				type: "POST",
				// url: 'http://localhost:8000/v1',
				url: alamat,
				data: JSON.stringify({
					model: "grok-beta",
					temperature,
					messages: [
						{
							role: "system",
							content: "You are an expert AI assistant who knows everything.",
						},
						{
							role: "user",
							content: messageContent,
						},
					],
				}),
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
			};

			const tokenSource = new CancellationTokenSource();
			try {
				const response = await this.requestService.request(
					options,
					tokenSource.token
				);
				// Convert VSBufferReadableStream to a string
				const chunks: string[] = [];
				await new Promise<void>((resolve, reject) => {
					response.stream.on("data", (chunk: VSBuffer) => {
						chunks.push(chunk.toString());
					});
					response.stream.on("error", reject);
					response.stream.on("end", resolve);
				});
				const responseText = chunks.join("");
				// Log the raw response to debug
				console.log("Raw Response:", responseText);
				// Try parsing the response as JSON
				let responseBody;
				try {
					responseBody = JSON.parse(responseText);
				} catch (error) {
					console.error("Failed to parse response as JSON:", error);
					this.notificationService.error(
						`Failed to parse response: ${error.message}`
					);
					return;
				}
				// Check for 'choices' and display the result in the response textarea
				if (responseBody.choices && responseBody.choices.length > 0) {
					const content = responseBody.choices[0].message.content;
					console.log("Content from x.ai:", content);

					// Display the result in the second textarea
					responseTextarea.value = content; // Assuming responseTextarea is the second textarea
					responseContainer.style.display = "flex"; // Show the response textarea
				} else {
					console.log("No message in the response from x.ai");
					responseTextarea.value = "No message in the response from x.ai";
					responseContainer.style.display = "flex"; // Ensure the response area is visible even if there's no message
				}
			} catch (error) {
				this.notificationService.error(
					`Error sending request: <<${error.message
					}>>. Kita kirimkan: ${JSON.stringify(options)}`
				);
			} finally {
				tokenSource.dispose();
			}
		};
		// Reset button
		const resetButton = document.createElement("button");
		resetButton.classList.add("neon-button", "reset-button");
		resetButton.textContent = "Reset";
		resetButton.onclick = () => {
			responseTextarea.value = "";
			responseContainer.style.display = "none"; // Hide the response textarea
			// this.notificationService.info('Response cleared and hidden.');
		};
		const runfmusButton = document.createElement("button");
		runfmusButton.classList.add("neon-button", "fmus-button");
		runfmusButton.textContent = "🖥️FMUS";
		runfmusButton.onclick = () => {
			const fmusCode = textArea.value.trim();
			if (!fmusCode) {
				this.notificationService.error(
					"Text area is empty. Please type some FMUS code."
				);
				return;
			}
			this.runFmusAtCwd(fmusCode);
		};
		const fmusButton = document.createElement("button");
		fmusButton.classList.add("neon-button", "fmus-button");
		fmusButton.textContent = "g.exe";
		fmusButton.onclick = () => {
			const fmusCode = textArea.value.trim();
			if (!fmusCode) {
				this.notificationService.error(
					"Text area is empty. Please type some FMUS code."
				);
				return;
			}
			this.run_fmus_ketik(fmusCode);
		};
		const send2TerminalButton = document.createElement("button");
		send2TerminalButton.classList.add("neon-button", "fmus-button");
		send2TerminalButton.textContent = "📟Term";
		send2TerminalButton.onclick = () => {
			const fmusCode = textArea.value.trim();
			if (!fmusCode) {
				this.notificationService.error(
					"Text area is empty. Please type some FMUS code."
				);
				return;
			}
			this.sendToTerminal(fmusCode);
		};
		// Create a container to hold the buttons and apply spacing
		const sendResetButtonContainer = document.createElement("div");
		sendResetButtonContainer.classList.add("button-container-old");
		sendResetButtonContainer.appendChild(sendButton);
		sendResetButtonContainer.appendChild(resetButton);
		sendResetButtonContainer.appendChild(runfmusButton);
		sendResetButtonContainer.appendChild(fmusButton);
		sendResetButtonContainer.appendChild(send2TerminalButton);
		sendContainer.appendChild(sendResetButtonContainer);

		const localhostContainer = dom.append(
			scrollableContainer,
			$(".send-container")
		);
		localhostContainer.style.display = "flex";
		localhostContainer.style.flexDirection = "column";
		localhostContainer.style.gap = "10px";

		////////////////////////  START: localhost
		const localhost_combobox = document.createElement("select");
		localhost_combobox.classList.add("glass-combobox");
		const localhostOptions = await this.readJsonFile(
			"c:/users/usef/localhost.json"
		);

		localhostOptions.forEach((command: string) => {
			const opt = document.createElement("option");
			opt.value = command;
			opt.textContent = command;
			localhost_combobox.appendChild(opt);
		});
		localhostContainer.appendChild(localhost_combobox);

		// Add neon button
		const localhostNeonButton = document.createElement("button");
		localhostNeonButton.classList.add("neon-button");
		localhostNeonButton.textContent = "Go";
		localhostNeonButton.onclick = async () => {
			const selectedUrl = localhost_combobox.value;
			if (selectedUrl) {
				await this.openerService.open(URI.parse(selectedUrl));
				// this.notificationService.info(`Opening URL: ${selectedUrl}`);
			} else {
				this.notificationService.error("No URL selected.");
			}
		};
		localhostContainer.appendChild(localhostNeonButton);
		////////////////////////  END: localhost
		/////////////////////// YUAGENT
	}

	///////////// START YUDE
	public sendToTerminal(text: string, title = "YuAgent"): void {
		const activeTerminal = this.terminalService.activeInstance;
		if (activeTerminal) {
			this.terminalService.focusInstance(activeTerminal);
			activeTerminal.sendText(text, true);
		} else {
			this.terminalService
				.createTerminal({ config: { name: title } })
				.then((terminal) => {
					terminal.sendText(text, true);
					this.terminalService.setActiveInstance(terminal);
					this.terminalService.focusInstance(terminal);
					terminal.sendText(text, true);
				});
		}
	}

	private togglePrimarySidebar(): void {
		// const layoutService = this.layoutService; // Assume layoutService is available in the class
		// const isVisible = layoutService.isVisible('workbench.parts.sidebar');
		// layoutService.setPartVisibility('workbench.parts.sidebar', !isVisible);
		this.commandService.executeCommand(
			"workbench.action.toggleSidebarVisibility"
		);
	}

	private toggleSecondarySidebar(): void {
		this.commandService.executeCommand("workbench.action.toggleAuxiliaryBar");
	}

	private run_fmus_ketik(fmus_code: string): void {
		this.sendToTerminal(`g.exe "/ketik)${fmus_code}"`);
	}
	///////////// END YUDE

	private hide(): void {
		if (this.csAccountCard) {
			this.csAccountCard.remove();
		}
	}
}
