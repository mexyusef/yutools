import * as vscode from 'vscode';
import { exec } from 'child_process';
// import * as path from 'path';

export const viewCustomDomains = vscode.commands.registerCommand('yutools.netlify.viewCustomDomains',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		vscode.window.showInformationMessage('Fetching custom domains...');

		exec('netlify domains:list', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to fetch custom domains: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage(`Custom Domains:\n${stdout}`);
			console.log(stdout);
		});
	});
