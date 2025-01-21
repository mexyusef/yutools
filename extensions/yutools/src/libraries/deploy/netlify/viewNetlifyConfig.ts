import * as vscode from 'vscode';
import { exec } from 'child_process';

export const viewNetlifyConfig = vscode.commands.registerCommand('yutools.netlify.viewNetlifyConfig', async () => {
	vscode.window.showInformationMessage('Displaying current Netlify configuration...');

	exec('netlify status', (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Failed to retrieve configuration: ${stderr || error.message}`);
			return;
		}
		vscode.window.showInformationMessage(`Netlify Configuration:\n${stdout}`);
		console.log(stdout);
	});
});
