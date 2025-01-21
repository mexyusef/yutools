import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const addCustomDomain = vscode.commands.registerCommand('yutools.netlify.addCustomDomain',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		const domain = await vscode.window.showInputBox({
			placeHolder: 'Enter the custom domain to add:',
		});

		if (domain) {
			const domainName = domain.trim();

			vscode.window.showInformationMessage(`Adding custom domain: ${domainName}`);

			exec(`netlify domains:add ${domainName}`, { cwd: projectPath }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to add custom domain: ${stderr || error.message}`);
					return;
				}
				vscode.window.showInformationMessage(`Custom domain ${domainName} added successfully!`);
				console.log(stdout);
			});
		}
	});
