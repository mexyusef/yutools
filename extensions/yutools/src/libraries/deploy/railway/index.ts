import * as vscode from 'vscode';
import { exec } from 'child_process';


function runCommand(command: string, callback: (output: string) => void) {
	exec(command, { cwd: vscode.workspace.rootPath }, (err, stdout, stderr) => {
		if (err) {
			vscode.window.showErrorMessage(`Error: ${stderr}`);
		} else {
			callback(stdout);
		}
	});
}

function runCommand2(command: string, successMessage: string, errorMessage: string) {
	exec(command, { cwd: vscode.workspace.rootPath }, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`${errorMessage}\n${stderr}`);
		} else {
			vscode.window.showInformationMessage(`${successMessage}\n${stdout}`);
		}
	});
}

const railwayLogin = vscode.commands.registerCommand('yutools.railway.railwayLogin', () => {
	runCommand('railway login', (output) => {
		vscode.window.showInformationMessage('Logged into Railway.');
	});
});

const linkProject = vscode.commands.registerCommand('yutools.railway.linkProject', () => {
	runCommand('railway link', (output) => {
		vscode.window.showInformationMessage('Project linked to Railway.');
	});
});

const deploy = vscode.commands.registerCommand('yutools.railway.deploy', () => {
	runCommand('railway up', (output) => {
		vscode.window.showInformationMessage('Project deployed successfully!');
	});
});

const deploy2 = vscode.commands.registerCommand('yutools.railway.deploy', () => {
	runCommand2(
		'railway up',
		'Project deployed successfully!',
		'Failed to deploy project.'
	);
});

const viewLogs = vscode.commands.registerCommand('yutools.railway.viewLogs', () => {
	runCommand('railway logs', (output) => {
		const logs = output.split('\n').slice(-20).join('\n'); // Show last 20 lines
		vscode.window.showInformationMessage('Deployment Logs:\n' + logs);
	});
});

const viewLogs2 = vscode.commands.registerCommand('yutools.railway.viewLogs', () => {
	exec('railway logs', { cwd: vscode.workspace.rootPath }, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Failed to fetch deployment logs.\n${stderr}`);
		} else {
			const logs = stdout || 'No logs available.';
			vscode.window.showInformationMessage(`Deployment Logs:\n${logs}`);
		}
	});
});

const cancelDeployment = vscode.commands.registerCommand('yutools.railway.cancelDeployment', () => {
	runCommand2(
		'railway cancel',
		'Deployment canceled successfully!',
		'Failed to cancel deployment.'
	);
});

const viewStatus = vscode.commands.registerCommand('yutools.railway.viewStatus', () => {
	exec('railway status', { cwd: vscode.workspace.rootPath }, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Failed to fetch deployment status.\n${stderr}`);
		} else {
			vscode.window.showInformationMessage(`Deployment Status:\n${stdout}`);
		}
	});
});

const openDashboard = vscode.commands.registerCommand('yutools.railway.openDashboard', () => {
	vscode.env.openExternal(vscode.Uri.parse('https://railway.app/dashboard'));
	vscode.window.showInformationMessage('Opened Railway dashboard.');
});
