import * as vscode from 'vscode';
import { exec } from 'child_process';


// Login to Netlify
export const netlifyLogin = vscode.commands.registerCommand('yutools.netlify.netlifyLogin', async () => {
	vscode.window.showInformationMessage('Logging in to Netlify...');

	exec('netlify login', (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Login failed: ${stderr || error.message}`);
			return;
		}
		vscode.window.showInformationMessage('Successfully logged in to Netlify!');
		console.log(stdout);
	});
});
