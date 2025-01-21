import * as vscode from 'vscode';
import * as fs from 'fs';
import { is_text_file } from '../utilities/is_text_file';
import { is_image_file } from '../utilities/is_image_file';

export const detect_open_filepath = vscode.commands.registerCommand(`yutools.fmus-vscode.detect_open_filepath`, async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active text editor found.');
		return;
	}

	const document = editor.document;
	const selection = editor.selection;
	const line = document.lineAt(selection.active.line);
	const lineText = line.text;

	// Regex to match both Unix and Windows absolute paths
	const absolutePathRegex = /([a-zA-Z]:\\[^\s\\]+(\\[^\s\\]+)*\.\w+)/g;
	const matches = lineText.match(absolutePathRegex);

	if (!matches || matches.length === 0) {
		console.log('No absolute file paths detected in the current line.');
		return;
	}

	for (const filePath of matches) {
		if (!fs.existsSync(filePath)) {
			console.log(`File does not exist: ${filePath}`);
			continue;
		}

		if (!fs.lstatSync(filePath).isFile()) {
			console.log(`Path is not a file: ${filePath}`);
			continue;
		}

		try {
			const uri = vscode.Uri.file(filePath);

			// Handle text files
			if (is_text_file(filePath)) {
				await vscode.window.showTextDocument(uri, { preview: false, viewColumn: vscode.ViewColumn.Beside });
				vscode.window.showInformationMessage(`Opened text file: ${filePath}`);
			}
			// Handle image files
			else if (is_image_file(filePath)) {
				await vscode.commands.executeCommand('vscode.open', uri);
				vscode.window.showInformationMessage(`Opened image file: ${filePath}`);
			}
			// Handle unsupported file types
			else {
				console.log(`Unsupported file type: ${filePath}`);
				vscode.window.showWarningMessage(`Unsupported file type: ${filePath}`);
			}
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to open file ${filePath}: ${error}`);
		}
	}
});