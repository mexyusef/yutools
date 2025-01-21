import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const buildReactFrontend = vscode.commands.registerCommand('yutools.aws.buildReactFrontend',
	() => {
		const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		if (!workspacePath) {
			vscode.window.showErrorMessage('No workspace folder found. Open a project folder to build.');
			return;
		}

		const command = `npm run build`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`React build failed: ${error}`);
			} else {
				vscode.window.showInformationMessage('React app successfully built.');
			}
		});
	});
