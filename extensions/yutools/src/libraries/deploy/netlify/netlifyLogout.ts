import * as vscode from 'vscode';
import { exec } from 'child_process';


// Logout from Netlify
export const netlifyLogout = vscode.commands.registerCommand('yutools.netlify.netlifyLogout', async () => {
	vscode.window.showInformationMessage('Logging out from Netlify...');

	exec('netlify logout', (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Logout failed: ${stderr || error.message}`);
			return;
		}
		vscode.window.showInformationMessage('Successfully logged out from Netlify!');
		console.log(stdout);
	});
});
