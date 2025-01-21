import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getPromptAndContext } from '../../../handlers/commands/vendor';
import { main_file_templates } from '../../../constants';

export function generateCommandName(key: string): string {
	return `yutools.previews.override${key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}File`;
}

export function generateCommandNameForExternalBrowser(key: string): string {
	return `yutools.previews.external${key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}File`;
}

/**
 * Function to create and register the override command for a specific key and file path.
 * @param context The VS Code extension context.
 * @param key The key representing the template type.
 * @param filePath The file path to override.
 */
export function registerOverrideCommand(context: vscode.ExtensionContext, key: string, filePath: string, preview_command: string) {
	const commandName = generateCommandName(key)

	context.subscriptions.push(
		vscode.commands.registerCommand(commandName, async () => {
			const { prompt: newContent, context } = await getPromptAndContext();
			if (newContent) {
				overrideFileWithBackup(filePath, newContent);

				vscode.commands.executeCommand(preview_command);
			}
		})
	);
}

export function registerExternalCommand(context: vscode.ExtensionContext, key: string, filePath: string, url: string) {
	const commandName = generateCommandNameForExternalBrowser(key)

	context.subscriptions.push(
		vscode.commands.registerCommand(commandName, async () => {
			const { prompt: newContent, context } = await getPromptAndContext();
			if (newContent) {
				overrideFileWithBackup(filePath, newContent);
				await vscode.commands.executeCommand(`yutools.previews.open_web_page`, url);
			}
		})
	);
}

export function registerModifyContent(context: vscode.ExtensionContext) {
	for (const [key, value] of Object.entries(main_file_templates)) {
		// utk preview di vscode webview stlh modify file
		registerOverrideCommand(context, key, value.file, value.command);
		// utk open di external browser stlh modify file
		registerExternalCommand(context, key, value.file, value.url);
	}
}

/**
 * Function to override a file with new content while creating a backup of the original file.
 * @param filePath The path to the file to override.
 * @param newContent The new content to write to the file.
 * @returns True if the override was successful, false otherwise.
 */
export function overrideFileWithBackup(filePath: string, newContent: string): boolean {
	try {
		// Ensure the file exists before proceeding
		if (!fs.existsSync(filePath)) {
			vscode.window.showErrorMessage(`File ${filePath} does not exist.`);
			return false;
		}

		const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
		const backupPath = `${filePath}.${timestamp}.bak`;

		// Read existing file content
		const currentContent = fs.readFileSync(filePath, 'utf-8');

		// Backup current file with timestamp
		fs.writeFileSync(backupPath, currentContent);

		// Write new content to the file
		fs.writeFileSync(filePath, newContent);

		vscode.window.showInformationMessage(`${path.basename(filePath)} overridden successfully.`);
		return true;
	} catch (error: any) {
		console.error(`Failed to override ${filePath}:`, error);
		vscode.window.showErrorMessage(`Failed to override ${filePath}: ${error.message}`);
		return false;
	}
}
