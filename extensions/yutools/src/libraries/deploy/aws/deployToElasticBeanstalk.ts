import * as vscode from 'vscode';
// import { exec } from 'child_process';
import { runCommand } from './runCommand';

export const deployToElasticBeanstalk = vscode.commands.registerCommand('yutools.aws.deployToElasticBeanstalk',
	() => {
		const appName = vscode.workspace.getConfiguration('yutools').get('elasticBeanstalkAppName') as string;

		if (!appName) {
			vscode.window.showErrorMessage('Elastic Beanstalk application name is not configured. Please set it in the extension settings.');
			return;
		}

		const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
		if (!workspacePath) {
			vscode.window.showErrorMessage('No workspace folder found. Open a project folder to deploy.');
			return;
		}

		const command = `eb deploy ${appName}`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Deployment to Elastic Beanstalk failed: ${error}`);
			} else {
				vscode.window.showInformationMessage('Project successfully deployed to Elastic Beanstalk.');
			}
		});
	});
