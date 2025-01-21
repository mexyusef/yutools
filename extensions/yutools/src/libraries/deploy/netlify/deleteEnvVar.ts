import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

// Delete Environment Variable
export const deleteEnvVar = vscode.commands.registerCommand('yutools.deleteEnvVar',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder is open.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;

		const result = await vscode.window.showInputBox({
			placeHolder: 'Enter the name of the environment variable to delete:',
		});

		if (result) {
			const varName = result.trim();

			if (!varName) {
				vscode.window.showErrorMessage('Environment variable name cannot be empty.');
				return;
			}

			vscode.window.showInformationMessage(`Deleting environment variable: ${varName}`);

			exec(`netlify env:unset ${varName}`, { cwd: projectPath }, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to delete environment variable: ${stderr || error.message}`);
					return;
				}
				vscode.window.showInformationMessage(`Environment variable ${varName} deleted successfully!`);
				console.log(stdout);
			});
		}
	});
