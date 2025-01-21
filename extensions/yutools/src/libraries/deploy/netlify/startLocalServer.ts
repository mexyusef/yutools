import * as vscode from 'vscode';
import { exec } from 'child_process';
// import * as path from 'path';

export const startLocalServer = vscode.commands.registerCommand('yutools.startLocalServer',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		vscode.window.showInformationMessage('Starting local server...');

		exec('npm start', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to start local server: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage('Local server started successfully!');
			console.log(stdout);
		});
	});
