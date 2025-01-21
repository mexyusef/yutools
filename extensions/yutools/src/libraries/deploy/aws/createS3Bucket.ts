import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const createS3Bucket = vscode.commands.registerCommand('yutools.aws.createS3Bucket',
	async () => {
		const bucketName = await vscode.window.showInputBox({
			prompt: 'Enter the name for the new S3 bucket:',
		});

		if (bucketName) {
			const command = `aws s3 mb s3://${bucketName}`;
			runCommand(command, (error, stdout, stderr) => {
				if (error) {
					vscode.window.showErrorMessage(`Failed to create S3 bucket: ${error}`);
				} else {
					vscode.window.showInformationMessage(`S3 bucket ${bucketName} created successfully.`);
				}
			});
		}
	});
