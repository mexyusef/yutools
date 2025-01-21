import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const listIAMRoles = vscode.commands.registerCommand('yutools.aws.listIAMRoles',
	() => {
		const command = `aws iam list-roles --output table`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to list IAM roles: ${error}`);
			} else {
				vscode.window.showInformationMessage('IAM Roles listed successfully. Check terminal for details.');
				console.log(stdout);
			}
		});
	});

