import * as vscode from 'vscode';
import { exec } from 'child_process';

function executeCommand(command: string, outputChannel: vscode.OutputChannel): Promise<void> {
	return new Promise((resolve, reject) => {
		const process = exec(command, (error, stdout, stderr) => {
			if (error) {
				outputChannel.appendLine(`Error: ${error.message}`);
				reject(error);
				return;
			}
			if (stderr) {
				outputChannel.appendLine(`Stderr: ${stderr}`);
			}
			outputChannel.appendLine(stdout);
			resolve();
		});

		process.stdout?.on('data', (data) => outputChannel.appendLine(data));
		process.stderr?.on('data', (data) => outputChannel.appendLine(data));
	});
}

const outputChannel = vscode.window.createOutputChannel('Render Deployment');

// context.subscriptions.push(quickDeploy, deployAndMonitor);

// 1. Quick Deploy to Render
const quickDeploy = vscode.commands.registerCommand('yutools.render.quickDeploy',
	async () => {
		outputChannel.show(true);
		outputChannel.appendLine('Starting Quick Deploy to Render...');

		const deployCommand = 'render deploy'; // Adjust this command to your deployment setup
		try {
			await executeCommand(deployCommand, outputChannel);
			vscode.window.showInformationMessage('Deployment to Render completed successfully.');
		} catch (error) {
			vscode.window.showErrorMessage('Deployment to Render failed. Check the output for details.');
		}
	});

// 3. Deploy and Monitor Logs
const deployAndMonitor = vscode.commands.registerCommand('yutools.render.deployAndMonitor',
	async () => {
		outputChannel.show(true);
		outputChannel.appendLine('Starting Deploy and Monitor Logs to Render...');

		const deployCommand = 'render deploy'; // Adjust this command to your deployment setup
		const logsCommand = 'render logs'; // Command to fetch logs

		try {
			await executeCommand(deployCommand, outputChannel);
			vscode.window.showInformationMessage('Deployment to Render completed successfully. Fetching logs...');

			outputChannel.appendLine('Fetching logs...');
			await executeCommand(logsCommand, outputChannel);
			vscode.window.showInformationMessage('Logs fetched successfully.');
		} catch (error) {
			vscode.window.showErrorMessage('Deployment or log fetching failed. Check the output for details.');
		}
	});
