/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ITextModel } from '../../../common/model.js';
import { ICodeEditor } from '../../editorBrowser.js';
import { joinPath, dirname } from '../../../../base/common/resources.js';
import { IEditorService } from '../../../../workbench/services/editor/common/editorService.js';
import { ITerminalService } from '../../../../workbench/contrib/terminal/browser/terminal.js';

import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
// import { FileService } from '../../../../platform/files/common/fileService';
import { IFileService } from '../../../../platform/files/common/files.js';
// import { IWorkbenchEnvironmentService } from 'vs/workbench/services/environment/common/environmentService';
import { URI } from '../../../../base/common/uri.js';
// import { VSBufferReadable } from '../../../../base/common/buffer';
import { getFileOrWorkingDirectory } from './utils/fileUtils.js';

const instruction_delimiter = `---------------------------------------------------------`;

export const hidden_prompt_prefix = `Please edit the code following these instructions:
${instruction_delimiter}`;

export const hidden_prompt_suffix = `${instruction_delimiter}
If you make a change, rewrite the entire file.`;

export class EditorInfoProvider {
	constructor(
		@IEditorService private readonly editorService: IEditorService,
		// @IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@INotificationService private readonly notificationService: INotificationService,
		@ITerminalService private readonly terminalService: ITerminalService,
		@IFileService private readonly fileService: IFileService
	) { }

	public async readHtmlContent(): Promise<string> {
		try {
			const extensionsUri = URI.file("c:/ai/fulled/extensions");
			const contentUri = joinPath(extensionsUri, 'fulled', 'dist', 'simplechat', 'index.html');

			const content = await this.fileService.readFile(contentUri);
			return content.value.toString();
		} catch (error) {
			this.notificationService.error(`Failed to read HTML content: ${error}`);
			throw error;
		}
	}

	public async readFile(relativePath: string): Promise<string> {
		try {
			const baseUri = URI.file("c:/ai/fulled/extensions");
			const fileUri = joinPath(baseUri, ...relativePath.split('/'));

			const content = await this.fileService.readFile(fileUri);
			return content.value.toString();
		} catch (error) {
			this.notificationService.error(`Failed to read file ${relativePath}: ${error}`);
			throw error;
		}
	}

	public getActiveTerminal() {
		// const activeTerminal = this.terminalService.getActiveInstance();
		const activeTerminal = this.terminalService.activeInstance;
		return activeTerminal;
	}

	// public sendToTerminal(text: string): void {
	// 	const activeTerminal = this.terminalService.activeInstance;
	// 	if (activeTerminal) {
	// 		activeTerminal.sendText(text, true);
	// 	} else {
	// 		this.notificationService.error('No active terminal found.');
	// 	}
	// }
	public sendToTerminal(text: string): void {
		const activeTerminal = this.terminalService.activeInstance;
		if (activeTerminal) {
			// Ensure the terminal is shown
			// this.terminalService.setActiveInstance(activeTerminal);
			// this.terminalService.showPanel(true);
			// Ensure the terminal is focused
			this.terminalService.focusInstance(activeTerminal);
			activeTerminal.sendText(text, true);
		} else {
			// If no active terminal, create a new one and send the text
			this.terminalService.createTerminal({ config: { name: 'ComboBox Output' } }).then(terminal => {
				terminal.sendText(text, true);
				this.terminalService.setActiveInstance(terminal);
				// Ensure the terminal is focused
				this.terminalService.focusInstance(terminal);
				terminal.sendText(text, true);
			});
			// If no active terminal, create a new one, focus it, and send the text
			// const newTerminal = await this.terminalService.createTerminal({ config: { name: 'ComboBox Output' } });
			// this.terminalService.setActiveInstance(newTerminal);
			// await this.terminalService.focusActiveInstance();
			// newTerminal.sendText(text, true);
		}
	}

	public info(pesan: string) {
		this.notificationService.info(pesan);
	}

	public error(pesan: string) {
		this.notificationService.error(pesan);
	}

	public async updateInfoTextArea(): Promise<string> {
		const activeEditor = this.editorService.activeTextEditorControl as ICodeEditor | undefined;
		let infoText = '';
		let selectionInfo = '';
		let contentInfo = '';
		let invoke_directory = '';

		if (activeEditor) {
			const model = activeEditor.getModel() as ITextModel | null;
			const selection = activeEditor.getSelection();
			invoke_directory = getFileOrWorkingDirectory(activeEditor, this.configurationService);
			if (model) {
				// const filePath = model.uri.toString();
				// const directory = URI.parse(filePath).path.substring(0, filePath.lastIndexOf('/'));
				const uri = model.uri;
				const filePath = uri.fsPath; // This gives us the correct file system path
				const directory = dirname(uri).fsPath; // This gives us the correct directory path
				const content = model.getValue();
				const selectionText = selection ? model.getValueInRange(selection) : 'No selection';
				// Get the language ID of the active editor
				const languageId = model.getLanguageId();
				infoText += `File Path: ${filePath}\n` +
					`Directory: ${directory}\n` +
					`Language: ${languageId}\n`
					// `Selection: ${selectionText}\n` +
					// `Content:\n${content}\n\n`
					;
				selectionInfo = `Selection: ${selectionText}\n`;
				contentInfo = `Content:\n${content}\n\n`;
			} else {
				const workspaceFolder = this.contextService.getWorkspace().folders[0];
				const defaultDirectory = workspaceFolder ? workspaceFolder.uri.fsPath : 'No workspace folder';
				infoText += `File Path: Untitled\n` +
					// `Directory: ${this.environmentService.userHome.fsPath}\n` +
					`Directory: ${defaultDirectory}\n` +
					`Language: plaintext\n`
					// `Selection: None\n` +
					// `Content:\n\n`
					;
				selectionInfo = `Selection: None\n`;
				contentInfo = `Content:\n\n`;
			}
		}

		// Get information about all open editors
		const allEditors = this.editorService.visibleTextEditorControls as ICodeEditor[];

		infoText += `Invoke dir: ${invoke_directory}\n`;
		infoText += `Number of active editors: ${allEditors.length}\n\n`;
		infoText += 'Open editors:\n';

		allEditors.forEach((editor, index) => {
			const model = editor.getModel();
			if (model) {
				const editorPath = model.uri.toString();
				infoText += `${index + 1}. ${editorPath}\n`;
			}
		});
		infoText += selectionInfo;
		infoText += contentInfo;
		return infoText;
	}

	public get_editor_directory_or_current_working_directory(): string {
		const activeEditor = this.editorService.activeTextEditorControl as ICodeEditor | undefined;
		const invoke_directory = getFileOrWorkingDirectory(activeEditor, this.configurationService);
		if (activeEditor) {
			const model = activeEditor.getModel() as ITextModel | null;
			if (model) {
				// ada editor dan ada file
				const uri = model.uri;
				const directory = dirname(uri).fsPath;
				if (directory === '.') { return invoke_directory; }
				return directory;
			} else {
				// ada editor dan tapi untitled
				const workspaceFolder = this.contextService.getWorkspace().folders[0];
				const defaultDirectory = workspaceFolder ? workspaceFolder.uri.fsPath : 'No workspace folder';
				return defaultDirectory;
			}
		}
		// tidak ada editor
		return invoke_directory;
	}
}
