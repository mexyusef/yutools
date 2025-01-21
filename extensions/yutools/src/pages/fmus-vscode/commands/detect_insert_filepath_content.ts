import * as vscode from 'vscode';
import * as fs from 'fs';
import { is_text_file } from '../utilities/is_text_file';

export const detect_insert_filepath_content = vscode.commands.registerCommand(`yutools.fmus-vscode.detect_insert_filepath_content`, async () => {
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
	// Regex to match both Unix and Windows absolute paths
	// const absolutePathRegex = /([a-zA-Z]:\\[^\s\\]+\\[^\s\\]*|\/[^\s\/]+\/[^\s\/]*)/g;
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

		if (!is_text_file(filePath)) {
			console.log(`File is not a text file: ${filePath}`);
			continue;
		}

		try {
			const fileContent = fs.readFileSync(filePath, 'utf-8');
			await editor.edit(editBuilder => {
				const position = line.range.end.translate(2, 0); // Insert 2 lines below
				editBuilder.insert(position, `\n${fileContent}\n`);
			});
			vscode.window.showInformationMessage(`Inserted content from: ${filePath}`);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to read or insert file content from ${filePath}: ${error}`);
		}
	}
});