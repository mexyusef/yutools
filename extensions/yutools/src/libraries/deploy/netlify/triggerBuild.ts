import * as vscode from 'vscode';
import { exec } from 'child_process';
// import * as path from 'path';

export const triggerBuild = vscode.commands.registerCommand('yutools.netlify.triggerBuild',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		vscode.window.showInformationMessage('Triggering build on Netlify...');

		exec('netlify deploy --build', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to trigger build: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage('Build triggered successfully!');
			console.log(stdout);
		});
	});
