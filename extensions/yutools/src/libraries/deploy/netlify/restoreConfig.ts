import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

export const restoreConfig = vscode.commands.registerCommand('yutools.netlify.restoreConfig',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;
		const backupFilePath = path.join(projectPath, 'netlify_backup.json');

		if (!fs.existsSync(backupFilePath)) {
			vscode.window.showErrorMessage('Backup file not found.');
			return;
		}

		const backupData = fs.readFileSync(backupFilePath, 'utf-8');

		vscode.window.showInformationMessage('Restoring Netlify configuration...');

		exec(`netlify env:set ${backupData}`, { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to restore configuration: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage('Netlify configuration restored successfully!');
			console.log(stdout);
		});
	});
