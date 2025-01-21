import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

export const backupConfig = vscode.commands.registerCommand('yutools.netlify.backupConfig',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;
		const backupFilePath = path.join(projectPath, 'netlify_backup.json');

		vscode.window.showInformationMessage('Backing up Netlify configuration...');

		exec('netlify status', { cwd: projectPath }, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to backup configuration: ${stderr || error.message}`);
				return;
			}

			fs.writeFileSync(backupFilePath, stdout);
			vscode.window.showInformationMessage('Netlify configuration backed up successfully!');
			console.log(stdout);
		});
	});
