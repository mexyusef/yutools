import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

const viewDeployLogs = vscode.commands.registerCommand('yutools.netlify.viewDeployLogs', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open.');
		return;
	}

	const projectPath = workspaceFolders[0].uri.fsPath;

	vscode.window.showInformationMessage('Fetching deployment logs...');

	exec('netlify logs', { cwd: projectPath }, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Failed to fetch logs: ${stderr || error.message}`);
			return;
		}
		vscode.window.showInformationMessage(`Deployment Logs:\n${stdout}`);
		console.log(stdout);
	});
});
