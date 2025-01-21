import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const deleteSiteSettings = vscode.commands.registerCommand('yutools.netlify.deleteSiteSettings',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		const result = await vscode.window.showInputBox({
			placeHolder: 'Enter the site setting to delete:',
		});

		if (result) {
			const settingName = result.trim();

			vscode.window.showInformationMessage(`Deleting site setting: ${settingName}`);

			exec(`netlify sites:delete --${settingName}`, { cwd: projectPath }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to delete site setting: ${stderr || error.message}`);
					return;
				}
				vscode.window.showInformationMessage(`Site setting ${settingName} deleted successfully!`);
				console.log(stdout);
			});
		}
	});

