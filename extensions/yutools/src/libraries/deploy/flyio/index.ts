import * as vscode from 'vscode';
// import { exec } from 'child_process';

const executeCommand = (cmd: string, terminalName: string) => {
	const terminal = vscode.window.createTerminal(terminalName);
	terminal.show();
	terminal.sendText(cmd);
};

// Command: Initialize Fly.io Project
const initializeFlyProject = vscode.commands.registerCommand('yutools.fly.init',
	() => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage("No workspace folder is open.");
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;
		executeCommand(`cd ${projectPath} && flyctl launch`, "Fly.io Initialization");
	});

// Command: View Deployment Logs
const viewDeploymentLogs = vscode.commands.registerCommand('yutools.fly.logs',
	() => {
		const terminal = vscode.window.createTerminal("Fly.io Logs");
		terminal.show();
		terminal.sendText(`flyctl logs`);
	});

// Command: Scale Project
const scaleProject = vscode.commands.registerCommand('yutools.fly.scale',
	async () => {
		const instances = await vscode.window.showInputBox({
			prompt: "Enter the number of instances to scale to",
			validateInput: (value) => isNaN(Number(value)) || Number(value) < 0 ? "Enter a valid number" : null,
		});

		const memory = await vscode.window.showInputBox({
			prompt: "Enter memory size per instance in MB",
			validateInput: (value) => isNaN(Number(value)) || Number(value) <= 0 ? "Enter a valid memory size" : null,
		});

		if (!instances || !memory) {
			vscode.window.showErrorMessage("Scaling requires both instances and memory size.");
			return;
		}

		executeCommand(`flyctl scale count ${instances} && flyctl scale memory ${memory}`, "Fly.io Scaling");
	});

// Command: Open Fly.io Dashboard
const openDashboard = vscode.commands.registerCommand('yutools.fly.dashboard',
	() => {
		vscode.env.openExternal(vscode.Uri.parse('https://fly.io/apps'));
	});

// Command: Set Secrets for Fly.io
const setFlySecrets = vscode.commands.registerCommand('yutools.fly.setSecrets',
	async () => {
		const secretKey = await vscode.window.showInputBox({ prompt: "Enter the secret key" });
		const secretValue = await vscode.window.showInputBox({ prompt: "Enter the secret value" });

		if (!secretKey || !secretValue) {
			vscode.window.showErrorMessage("Both key and value are required to set a secret.");
			return;
		}

		executeCommand(`flyctl secrets set ${secretKey}=${secretValue}`, "Fly.io Secrets");
	});

// Command: Destroy Fly.io Project
const destroyFlyProject = vscode.commands.registerCommand('yutools.fly.destroy',
	async () => {
		const confirm = await vscode.window.showQuickPick(["Yes", "No"], {
			placeHolder: "Are you sure you want to destroy this project?",
		});

		if (confirm === "Yes") {
			executeCommand(`flyctl apps destroy`, "Fly.io Destroy");
		}
	});

// context.subscriptions.push(
// 	initializeFlyProject,
// 	viewDeploymentLogs,
// 	scaleProject,
// 	openDashboard,
// 	setFlySecrets,
// 	destroyFlyProject
// );

