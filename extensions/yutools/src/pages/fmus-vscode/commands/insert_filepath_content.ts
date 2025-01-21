import * as vscode from 'vscode';
import * as fs from 'fs';
import { is_text_file } from '../utilities/is_text_file';

export const insert_filepath_content = vscode.commands.registerCommand(`yutools.insert_filepath_content`, async () => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const selection = editor.selection;
		const line = document.lineAt(selection.active.line);
		let filePath = line.text.trim();

		if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile() && is_text_file(filePath)) {
			const fileContent = fs.readFileSync(filePath, 'utf-8');
			await editor.edit(editBuilder => {
				const position = line.range.end.translate(2, 0); // Next 2 lines
				editBuilder.insert(position, `\n${fileContent}\n`);
			});
		} else {
			vscode.window.showErrorMessage('File does not exist or is not a text file.');
		}
	}
});
