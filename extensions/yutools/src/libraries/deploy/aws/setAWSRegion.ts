import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const setAWSRegion = vscode.commands.registerCommand('yutools.aws.setAWSRegion',
	async () => {
		const region = await vscode.window.showInputBox({
			prompt: 'Enter AWS Region (e.g., us-west-2):',
		});

		if (region) {
			const command = `aws configure set region ${region}`;
			runCommand(command, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to set AWS region: ${error}`);
				} else {
					vscode.window.showInformationMessage(`AWS region set to ${region}`);
				}
			});
		}
	});
