import * as vscode from 'vscode';
import { exec } from 'child_process';
// import * as path from 'path';

export const viewEnvVars = vscode.commands.registerCommand('yutools.viewEnvVars',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		vscode.window.showInformationMessage('Fetching environment variables...');

		exec('netlify env:list', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to fetch environment variables: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage(`Environment Variables:\n${stdout}`);
			console.log(stdout);
		});
	});
