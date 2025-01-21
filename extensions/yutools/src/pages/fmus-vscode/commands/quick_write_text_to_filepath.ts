import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getCurrentProjectFolder } from '../utilities/getCurrentProjectFolder';

/**
 * Writes selected text to a specified file path.
 *
 * This function is triggered by a command in the VSCode extension. It reads the selected text,
 * interprets the first line as the file path, and writes the remaining lines to that file.
 * If the file path is not absolute, it appends it to the current project folder.
 * It also creates any necessary directories to ensure the file can be written.
 *
 * @param editor - The active text editor from which the text is selected.
 * @returns A promise that resolves when the text is written to the file or an error message is shown.
 */
export const quick_write_text_to_filepath = vscode.commands.registerCommand(`yutools.quick_write_text_to_filepath`, async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active text editor found.');
		return;
	}

	const document = editor.document;
	const selection = editor.selection;
	const text = document.getText(selection);
	const lines = text.split('\n');

	if (lines.length < 2) {
		vscode.window.showErrorMessage('Selection must contain at least two lines.');
		return;
	}

	let filePath = lines[0].trim();
	const content = lines.slice(1).join('\n');

	if (!path.isAbsolute(filePath)) {
		filePath = path.join(getCurrentProjectFolder(), filePath);
	}

	try {
		const dirPath = path.dirname(filePath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
		fs.writeFileSync(filePath, content, 'utf-8');
		vscode.window.showInformationMessage(`Content written to ${filePath}`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to write content to ${filePath}: ${error.message}`);
	}
});
