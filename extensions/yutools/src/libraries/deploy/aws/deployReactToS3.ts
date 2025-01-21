import * as vscode from 'vscode';
// import { exec } from 'child_process';
import { runCommand } from './runCommand';

export const deployReactToS3 = vscode.commands.registerCommand('yutools.aws.deployReactToS3', () => {
	const bucketName = vscode.workspace.getConfiguration('yutools').get('reactS3BucketName') as string;

	if (!bucketName) {
		vscode.window.showErrorMessage('S3 bucket name for React app is not configured. Please set it in the extension settings.');
		return;
	}

	const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
	if (!workspacePath) {
		vscode.window.showErrorMessage('No workspace folder found. Open a project folder to deploy.');
		return;
	}

	const buildPath = `${workspacePath}/build`;
	const command = `aws s3 sync ${buildPath} s3://${bucketName} --delete`;
	runCommand(command, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`React app deployment to S3 failed: ${error}`);
		} else {
			vscode.window.showInformationMessage('React app successfully deployed to S3.');
		}
	});
});
