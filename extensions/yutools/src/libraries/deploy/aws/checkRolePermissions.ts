import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const checkRolePermissions = vscode.commands.registerCommand('yutools.aws.checkRolePermissions',
	async () => {
		const roleName = await vscode.window.showInputBox({ prompt: 'Enter the name of the IAM role to check permissions for:' });
		if (!roleName) {
			vscode.window.showErrorMessage('Role name is required.');
			return;
		}

		const command = `aws iam list-attached-role-policies --role-name ${roleName}`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to check permissions for IAM role: ${error}`);
			} else {
				vscode.window.showInformationMessage(`Permissions for IAM Role '${roleName}' retrieved successfully. Check terminal for details.`);
				console.log(stdout);
			}
		});
	});

