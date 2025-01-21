import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

// Add or Update Environment Variable
export const addUpdateEnvVar = vscode.commands.registerCommand('yutools.netlify.addUpdateEnvVar',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		const result = await vscode.window.showInputBox({
			placeHolder: 'Enter environment variable in the format: VAR_NAME=VALUE',
		});

		if (result) {
			const [varName, value] = result.split('=');
			if (!varName || !value) {
				vscode.window.showErrorMessage('Invalid environment variable format. Use: VAR_NAME=VALUE');
				return;
			}

			vscode.window.showInformationMessage(`Setting environment variable: ${varName}`);

			exec(`netlify env:set ${varName}=${value}`, { cwd: projectPath }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to set environment variable: ${stderr || error.message}`);
					return;
				}
				vscode.window.showInformationMessage(`Environment variable ${varName} set successfully!`);
				console.log(stdout);
			});
		}
	});
