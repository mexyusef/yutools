import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const attachPolicyToRole = vscode.commands.registerCommand('yutools.aws.attachPolicyToRole',
	async () => {
		const roleName = await vscode.window.showInputBox({ prompt: 'Enter the name of the IAM role to attach a policy to:' });
		const policyArn = await vscode.window.showInputBox({ prompt: 'Enter the ARN of the policy to attach:' });
		if (!roleName || !policyArn) {
			vscode.window.showErrorMessage('Both role name and policy ARN are required.');
			return;
		}

		const command = `aws iam attach-role-policy --role-name ${roleName} --policy-arn ${policyArn}`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to attach policy to IAM role: ${error}`);
			} else {
				vscode.window.showInformationMessage(`Policy attached to IAM Role '${roleName}' successfully.`);
			}
		});
	});
