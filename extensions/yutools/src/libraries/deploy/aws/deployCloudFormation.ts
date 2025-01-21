import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const deployCloudFormation = vscode.commands.registerCommand('yutools.aws.deployCloudFormation',
	async () => {
		const templatePath = await vscode.window.showInputBox({
			prompt: 'Enter the path to the CloudFormation template file:',
		});

		const stackName = await vscode.window.showInputBox({
			prompt: 'Enter the name for the CloudFormation stack:',
		});

		if (!templatePath || !stackName) {
			vscode.window.showErrorMessage('Both template path and stack name are required.');
			return;
		}

		const command = `aws cloudformation deploy --template-file ${templatePath} --stack-name ${stackName} --capabilities CAPABILITY_NAMED_IAM`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`CloudFormation deployment failed: ${error}`);
			} else {
				vscode.window.showInformationMessage(`CloudFormation stack ${stackName} deployed successfully.`);
			}
		});
	});
