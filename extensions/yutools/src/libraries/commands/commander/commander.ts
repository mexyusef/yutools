import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function register_commander_v2_commands(context: vscode.ExtensionContext) {
	// Read commands from package.json
	const packageJsonPath = path.join(context.extensionPath, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
	const commands = packageJson.contributes.commands;

	context.subscriptions.push(
		vscode.commands.registerCommand('yutools.commands.commander.showWebviewCommander', () => {
			const panel = vscode.window.createWebviewPanel(
				'customWebview', // Identifies the type of the webview
				'Futuristic Webview', // Title of the panel
				vscode.ViewColumn.One, // Editor column to show the webview in
				{
					enableScripts: true, // Enable JavaScript in the webview
				}
			);

			// Pass the commands to the webview
			panel.webview.html = getWebviewContent(commands);
			panel.webview.onDidReceiveMessage(
				(message) => {
					if (message.command) {
						vscode.commands.executeCommand(message.command);
					}
				},
				undefined,
				context.subscriptions
			);

		})
	);
}

function getWebviewContent(commands: any[]): string {
	// Generate button HTML for each command
	const buttonsHtml = commands
		.map((cmd) => {
			return `<button id="${cmd.command}" class="neon-button">${cmd.title}</button>`;
		})
		.join('');

	return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Yutools Commander 2.0</title>
	<style>
		${getStyles()}
	</style>
</head>
<body>
	<div class="container">
		${buttonsHtml}
	</div>
	<script>
		${getScript()}
	</script>
</body>
</html>
    `;
}

function getStyles(): string {
	return `
body {
	margin: 0;
	padding: 0;
	background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	overflow: hidden;
	font-family: 'Arial', sans-serif;
}

.container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	max-width: 800px;
	padding: 20px;
	overflow-y: auto; /* Add vertical scrollbar if needed */
            max-height: 80vh; /* Limit the container height */
}

.neon-button {
	background: rgba(0, 0, 0, 0.5);
	border: 2px solid #00ffff;
	color: #00ffff;
	padding: 15px 30px;
	margin: 10px;
	font-size: 14px;
	cursor: pointer;
	border-radius: 10px;
	box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff;
	transition: all 0.3s ease;
	backdrop-filter: blur(10px);
	flex: 1 1 auto;
	min-width: 150px;
	text-align: center;
}

.neon-button:hover {
	background: #00ffff;
	color: #000;
	box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff;
}

@keyframes gradientBackground {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}

body {
	background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
	background-size: 200% 200%;
	animation: gradientBackground 10s ease infinite;
}
`;
}

function getScript(): string {
	return `
const vscode = acquireVsCodeApi();

document.querySelectorAll('.neon-button').forEach((button) => {
	button.addEventListener('click', () => {
		vscode.postMessage({ command: button.id });
	});
});
	`;
}
