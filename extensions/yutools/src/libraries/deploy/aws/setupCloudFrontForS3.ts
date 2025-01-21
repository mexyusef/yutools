import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const setupCloudFrontForS3 = vscode.commands.registerCommand('yutools.aws.setupCloudFrontForS3',
	async () => {
		const bucketName = vscode.workspace.getConfiguration('yutools').get('s3BucketName') as string;

		if (!bucketName) {
			vscode.window.showErrorMessage('S3 bucket name is not configured. Please set it in the extension settings.');
			return;
		}

		const command = `aws cloudfront create-distribution --origin-domain-name ${bucketName}.s3.amazonaws.com`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to set up CloudFront: ${error}`);
			} else {
				vscode.window.showInformationMessage('CloudFront distribution created successfully.');
			}
		});
	});
