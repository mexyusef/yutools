import * as vscode from 'vscode';
import { exec } from 'child_process';
// import { getCurrentProjectFolder } from '../project_commands';

export const execute_shell_command = vscode.commands.registerCommand(`yutools.execute_shell_command`, () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	const document = editor.document;
	const selection = editor.selection;
	const line = document.lineAt(selection.active.line);
	const text = line.text.trim();
	exec(text, (error, stdout, stderr) => {
		editor.edit(editBuilder => {
			const position = new vscode.Position(line.lineNumber + 1, 0);
			if (error) {
				editBuilder.insert(position, `Error: ${stderr}`);
			} else {
				editBuilder.insert(position, stdout);
			}
		});
	});
});
