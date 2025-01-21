import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const deployBranch = vscode.commands.registerCommand('yutools.netlify.deployBranch',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		const result = await vscode.window.showInputBox({
			placeHolder: 'Enter branch name to deploy:',
		});

		if (result) {
			const branchName = result.trim();

			vscode.window.showInformationMessage(`Deploying branch: ${branchName}`);

			exec(`netlify deploy --branch ${branchName}`, { cwd: projectPath }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to deploy branch: ${stderr || error.message}`);
					return;
				}
				vscode.window.showInformationMessage(`Branch ${branchName} deployed successfully!`);
				console.log(stdout);
			});
		}
	});
