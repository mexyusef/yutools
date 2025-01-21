import * as vscode from 'vscode';
import * as fs from 'fs';
// import * as path from 'path';
import { is_text_file } from '../utilities/is_text_file';

export const detect_insert_filepath_content_to_new_editor = vscode.commands.registerCommand(`yutools.fmus-vscode.detect_insert_filepath_content_to_new_editor`, async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active text editor found.');
		return;
	}

	const document = editor.document;
	const selection = editor.selection;
	const line = document.lineAt(selection.active.line);
	const lineText = line.text;

	// Regex to match absolute file paths
	// const absolutePathRegex = /(\/[^\s\/]+\/[^\s\/]*)/g;
	// const absolutePathRegex = /([a-zA-Z]:\\[^\s\\]+\\[^\s\\]*|\/[^\s\/]+\/[^\s\/]*)/g;
	const absolutePathRegex = /([a-zA-Z]:\\[^\s\\]+(\\[^\s\\]+)*\.\w+)/g;
	const matches = lineText.match(absolutePathRegex);

	if (!matches || matches.length === 0) {
		vscode.window.showErrorMessage('No absolute file paths detected in the current line.');
		return;
	}

	// Create a new untitled document
	const newDocument = await vscode.workspace.openTextDocument({ content: '', language: 'plaintext' });
	const newEditor = await vscode.window.showTextDocument(newDocument, { viewColumn: vscode.ViewColumn.Beside, preview: false });

	// Process each detected file path
	for (const filePath of matches) {
		if (!fs.existsSync(filePath)) {
			vscode.window.showErrorMessage(`File does not exist: ${filePath}`);
			continue;
		}

		if (!fs.lstatSync(filePath).isFile()) {
			vscode.window.showErrorMessage(`Path is not a file: ${filePath}`);
			continue;
		}

		if (!is_text_file(filePath)) {
			vscode.window.showErrorMessage(`File is not a text file: ${filePath}`);
			continue;
		}

		try {
			const fileContent = fs.readFileSync(filePath, 'utf-8');
			await newEditor.edit(editBuilder => {
				// Insert the file content into the new editor
				const lastLine = newDocument.lineAt(newDocument.lineCount - 1);
				const position = lastLine.range.end;
				editBuilder.insert(position, `\n${filePath}:\n${fileContent}\n`);
			});
			vscode.window.showInformationMessage(`Inserted content from: ${filePath}`);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to read or insert file content from ${filePath}: ${error}`);
		}
	}
});