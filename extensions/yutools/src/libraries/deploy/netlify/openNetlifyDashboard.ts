import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
// Open Netlify Dashboard
export const openNetlifyDashboard = vscode.commands.registerCommand('yutools.netlify.openNetlifyDashboard',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		vscode.window.showInformationMessage('Opening Netlify dashboard in your browser...');

		exec('netlify open', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to open dashboard: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage('Netlify dashboard opened!');
			console.log(stdout);
		});
	});
