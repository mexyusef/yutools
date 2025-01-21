import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export const stopLocalServer = vscode.commands.registerCommand('yutools.stopLocalServer',
	async () => {
		vscode.window.showInformationMessage('Stopping local server...');

		exec('pkill -f "npm start"', (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to stop local server: ${stderr || error.message}`);
				return;
			}
			vscode.window.showInformationMessage('Local server stopped!');
			console.log(stdout);
		});
	});
