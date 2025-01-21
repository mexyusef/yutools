import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const deployCommand = vscode.commands.registerCommand('yutools.netlify.deployToNetlify',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder found.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		vscode.window.showInformationMessage('Deploying to Netlify...');

		exec('netlify deploy --prod', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Error deploying: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage(stdout);
		});
	});
