import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const viewSiteSettings = vscode.commands.registerCommand('yutools.netlify.viewSiteSettings',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		vscode.window.showInformationMessage('Fetching site settings...');

		exec('netlify sites:info', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to fetch site settings: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage(`Site Settings:\n${stdout}`);
			console.log(stdout);
		});
	});
