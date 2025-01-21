import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

// Check Deployment Status
const checkDeployStatus = vscode.commands.registerCommand('yutools.netlify.checkDeployStatus',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		vscode.window.showInformationMessage('Checking deployment status...');

		exec('netlify status', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to fetch status: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage(`Deployment Status:\n${stdout}`);
			console.log(stdout);
		});
	});
