import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const pushDockerToECR = vscode.commands.registerCommand('yutools.aws.pushDockerToECR',
	async () => {
		const repositoryName = await vscode.window.showInputBox({
			prompt: 'Enter ECR repository name:',
		});

		if (!repositoryName) {
			vscode.window.showErrorMessage('ECR repository name is required.');
			return;
		}

		const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		if (!workspacePath) {
			vscode.window.showErrorMessage('No workspace folder found. Open a project folder to push the image.');
			return;
		}

		const command = `aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-west-2.amazonaws.com && docker build -t ${repositoryName} . && docker tag ${repositoryName}:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-west-2.amazonaws.com/${repositoryName}:latest && docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-west-2.amazonaws.com/${repositoryName}:latest`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to push Docker image to ECR: ${error}`);
			} else {
				vscode.window.showInformationMessage('Docker image successfully pushed to ECR.');
			}
		});
	});
