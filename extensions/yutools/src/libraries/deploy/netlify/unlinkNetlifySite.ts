import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const unlinkNetlifySite = vscode.commands.registerCommand('yutools.netlify.unlinkNetlifySite', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open.');
		return;
	}

	const projectPath = workspaceFolders[0].uri.fsPath;

	vscode.window.showInformationMessage('Unlinking project from Netlify site...');

	exec('netlify unlink', { cwd: projectPath }, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Failed to unlink project: ${stderr || error.message}`);
			return;
		}
		vscode.window.showInformationMessage('Project successfully unlinked from Netlify!');
		console.log(stdout);
	});
});

