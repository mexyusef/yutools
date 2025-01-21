import * as vscode from 'vscode';
import { exec } from 'child_process';

// Link Project to Site
export const linkNetlifySite = vscode.commands.registerCommand('yutools.netlify.linkNetlifySite', async () => {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder is open.');
		return;
	}

	const projectPath = workspaceFolders[0].uri.fsPath;

	vscode.window.showInformationMessage('Linking project to an existing Netlify site...');

	exec('netlify link', { cwd: projectPath }, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Failed to link project: ${stderr || error.message}`);
			return;
		}
		vscode.window.showInformationMessage('Project successfully linked to Netlify!');
		console.log(stdout);
	});
});
