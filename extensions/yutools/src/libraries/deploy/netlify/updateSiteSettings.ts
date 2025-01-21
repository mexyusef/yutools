import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const updateSiteSettings = vscode.commands.registerCommand('yutools.netlify.updateSiteSettings',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		const result = await vscode.window.showInputBox({
			placeHolder: 'Enter site setting to update (e.g., build.command or build.publish)',
		});

		if (result) {
			const settingName = result.trim();

			vscode.window.showInformationMessage(`Updating site setting: ${settingName}`);

			exec(`netlify sites:update --${settingName}`, { cwd: projectPath }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to update site setting: ${stderr || error.message}`);
					return;
				}
				vscode.window.showInformationMessage(`Site setting ${settingName} updated successfully!`);
				console.log(stdout);
			});
		}
	});
