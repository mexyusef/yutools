import * as vscode from 'vscode';
import { exec } from 'child_process';
import { getCurrentProjectFolder } from '../utilities/getCurrentProjectFolder';

export const execute_shell_command_at_workdir = vscode.commands.registerCommand(`yutools.execute_shell_command_at_workdir`,
	async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const document = editor.document;
		const selection = editor.selection;
		const line = document.lineAt(selection.active.line);
		const text = line.text.trim();

		// Specify the working directory
		const workingDirectory = getCurrentProjectFolder();

		exec(text, { cwd: workingDirectory }, (error, stdout, stderr) => {
			editor.edit(editBuilder => {
				const position = new vscode.Position(line.lineNumber + 1, 0);
				if (error) {
					editBuilder.insert(position, `Error: ${stderr}`);
				} else {
					editBuilder.insert(position, stdout);
				}
			});
		});
	}
);
