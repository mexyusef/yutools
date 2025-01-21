import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const deleteIAMRole = vscode.commands.registerCommand('yutools.aws.deleteIAMRole',
	async () => {
		const roleName = await vscode.window.showInputBox({ prompt: 'Enter the name of the IAM role to delete:' });
		if (!roleName) {
			vscode.window.showErrorMessage('Role name is required.');
			return;
		}

		const command = `aws iam delete-role --role-name ${roleName}`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to delete IAM role: ${error}`);
			} else {
				vscode.window.showInformationMessage(`IAM Role '${roleName}' deleted successfully.`);
			}
		});
	});
