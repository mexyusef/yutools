import * as vscode from 'vscode';
import { runCommand } from './runCommand';

export const setupCodePipeline = vscode.commands.registerCommand('yutools.aws.setupCodePipeline',
	async () => {
		const pipelineName = await vscode.window.showInputBox({
			prompt: 'Enter the name for the CodePipeline:',
		});

		const repositoryUrl = await vscode.window.showInputBox({
			prompt: 'Enter the repository URL to integrate with CodePipeline:',
		});

		if (!pipelineName || !repositoryUrl) {
			vscode.window.showErrorMessage('Both pipeline name and repository URL are required.');
			return;
		}

		const command = `aws codepipeline create-pipeline --cli-input-json file://pipeline-config.json`;
		runCommand(command, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Failed to set up CodePipeline: ${error}`);
			} else {
				vscode.window.showInformationMessage(`CodePipeline ${pipelineName} set up successfully.`);
			}
		});
	});
