import * as vscode from 'vscode';
import * as fs from 'fs';
import { find_all_text_files } from '../utilities/find_all_text_files';
import { getCurrentProjectFolder } from '../utilities/getCurrentProjectFolder';

export const list_text_files_at_curdir = vscode.commands.registerCommand(`yutools.list_text_files_at_curdir`, async () => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const selection = editor.selection;
		const line = document.lineAt(selection.active.line);
		let folderPath = line.text.trim();

		// Use current project folder if folderPath is empty
		if (!folderPath) {
			folderPath = getCurrentProjectFolder();
		}

		if (fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()) {
			const textFiles = find_all_text_files(folderPath);
			const textFilesList = textFiles.join('\n');
			await editor.edit(editBuilder => {
				const position = line.range.end.translate(2, 0); // Next 2 lines
				editBuilder.insert(position, `\n${textFilesList}\n`);
			});
		} else {
			vscode.window.showErrorMessage('Folder does not exist or is not a directory.');
		}
	}
});
