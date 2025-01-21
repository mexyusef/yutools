import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const viewDeployments = vscode.commands.registerCommand('yutools.netlify.viewDeployments',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		vscode.window.showInformationMessage('Fetching deployments...');

		exec('netlify deploy:list', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to fetch deployments: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage(`Deployments:\n${stdout}`);
			console.log(stdout);
		});
	});
