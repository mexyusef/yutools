import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { is_text_file } from '../utilities/is_text_file';

export const insert_filepath_content_v2 = vscode.commands.registerCommand(`yutools.insert_filepath_content_v2`, async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active text editor found.');
		return;
	}

	const document = editor.document;
	const selection = editor.selection;
	const line = document.lineAt(selection.active.line);
	let filePath = line.text.trim();

	// Resolve relative paths to absolute paths
	if (!path.isAbsolute(filePath)) {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			filePath = path.resolve(workspaceFolder.uri.fsPath, filePath);
		} else {
			vscode.window.showErrorMessage('No workspace folder found to resolve relative path.');
			return;
		}
	}

	if (!fs.existsSync(filePath)) {
		vscode.window.showErrorMessage('File does not exist.');
		return;
	}

	if (!fs.lstatSync(filePath).isFile()) {
		vscode.window.showErrorMessage('Path is not a file.');
		return;
	}

	if (!is_text_file(filePath)) {
		vscode.window.showErrorMessage('File is not a text file.');
		return;
	}

	try {
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		await editor.edit(editBuilder => {
			const position = line.range.end.translate(2, 0); // Next 2 lines
			editBuilder.insert(position, `\n${fileContent}\n`);
		});
		vscode.window.showInformationMessage('File content inserted successfully.');
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to read or insert file content: ${error}`);
	}
});