import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const removeCustomDomain = vscode.commands.registerCommand('yutools.netlify.removeCustomDomain',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		const domain = await vscode.window.showInputBox({
			placeHolder: 'Enter the custom domain to remove:',
		});

		if (domain) {
			const domainName = domain.trim();

			vscode.window.showInformationMessage(`Removing custom domain: ${domainName}`);

			exec(`netlify domains:remove ${domainName}`, { cwd: projectPath }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to remove custom domain: ${stderr || error.message}`);
					return;
				}
				vscode.window.showInformationMessage(`Custom domain ${domainName} removed successfully!`);
				console.log(stdout);
			});
		}
	});
