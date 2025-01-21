import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

// Create New Site
export const createNetlifySite = vscode.commands.registerCommand('yutools.netlify.createNetlifySite', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open.');
		return;
	}

	const projectPath = workspaceFolders[0].uri.fsPath;

	vscode.window.showInformationMessage('Creating a new Netlify site...');

	exec('netlify sites:create', { cwd: projectPath }, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Failed to create site: ${stderr || error.message}`);
			return;
		}
		vscode.window.showInformationMessage('New Netlify site successfully created!');
		console.log(stdout);
	});
});

