import * as vscode from 'vscode';
// import { exec } from 'child_process';
import { runCommand } from './runCommand';

export const deployToLambda = vscode.commands.registerCommand('yutools.aws.deployToLambda',
	() => {
		const functionName = vscode.workspace.getConfiguration('yutools').get('lambdaFunctionName') as string;

		if (!functionName) {
			vscode.window.showErrorMessage('Lambda function name is not configured. Please set it in the extension settings.');
			return;
		}

		const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		if (!workspacePath) {
			vscode.window.showErrorMessage('No workspace folder found. Open a project folder to deploy.');
			return;
		}

		const command = `zip -r function.zip . && aws lambda update-function-code --function-name ${functionName} --zip-file fileb://function.zip`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Deployment to Lambda failed: ${error}`);
			} else {
				vscode.window.showInformationMessage('Project successfully deployed to Lambda.');
			}
		});
	});

