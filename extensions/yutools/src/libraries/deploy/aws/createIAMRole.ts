import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const createIAMRole = vscode.commands.registerCommand('yutools.aws.createIAMRole',
	async () => {
		const roleName = await vscode.window.showInputBox({ prompt: 'Enter the name of the IAM role to create:' });
		if (!roleName) {
			vscode.window.showErrorMessage('Role name is required.');
			return;
		}

		const assumeRolePolicy = `{
			"Version": "2012-10-17",
			"Statement": [
					{
							"Effect": "Allow",
							"Principal": { "Service": "ec2.amazonaws.com" },
							"Action": "sts:AssumeRole"
					}
			]
	}`;

		const command = `aws iam create-role --role-name ${roleName} --assume-role-policy-document '${assumeRolePolicy}'`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to create IAM role: ${error}`);
			} else {
				vscode.window.showInformationMessage(`IAM Role '${roleName}' created successfully.`);
			}
		});
	});
