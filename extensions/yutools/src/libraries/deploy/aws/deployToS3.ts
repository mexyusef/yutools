import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const deployToS3 = vscode.commands.registerCommand('yutools.aws.deployToS3',
	() => {
		const bucketName = vscode.workspace.getConfiguration('yutools').get('s3BucketName') as string;

		if (!bucketName) {
			vscode.window.showErrorMessage('S3 bucket name is not configured. Please set it in the extension settings.');
			return;
		}

		const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		if (!workspacePath) {
			vscode.window.showErrorMessage('No workspace folder found. Open a project folder to deploy.');
			return;
		}

		const command = `aws s3 sync ${workspacePath} s3://${bucketName} --delete`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Deployment to S3 failed: ${error}`);
			} else {
				vscode.window.showInformationMessage('Project successfully deployed to S3.');
			}
		});
	});

