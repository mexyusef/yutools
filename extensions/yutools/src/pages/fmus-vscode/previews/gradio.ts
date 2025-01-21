import * as vscode from 'vscode';
import { extension_name } from '../common';
import { exec, spawn, ChildProcess } from 'child_process';

const PORT = 8250;
let gradioServer: ChildProcess | null = null;
let activeWebviewPanel: vscode.WebviewPanel | null = null;

async function startGradioServer(rootDir: string) {
	try {
		console.log(`Starting Gradio server for ${rootDir}...`);
		gradioServer = spawn('python', ['app.py'], {
			cwd: rootDir,
			env: { ...process.env, PORT: PORT.toString() },
			shell: true,
		});

		if (gradioServer === null || gradioServer === undefined) {
			return null;
		}

		// gradioServer.stdout.on('data', (data) => {
		//     console.log(`Gradio server output: ${data}`);
		// });

		// gradioServer.stderr.on('data', (data) => {
		//     console.error(`Gradio server error: ${data}`);
		// });

		if (gradioServer) {
			gradioServer.stdout?.on('data', (data) => {
				console.log(`Gradio server output: ${data}`);
			});

			gradioServer.stderr?.on('data', (data) => {
				console.error(`Gradio server error: ${data}`);
			});


			gradioServer.on('close', (code) => {
				console.log(`Gradio server exited with code ${code}`);
			});
		} else {
			console.error('Failed to start Gradio server');
			return null;
		}

		return gradioServer;
	} catch (error) {
		console.error('Failed to start Gradio server:', error);
		throw error;
	}
}

function createWebview(title: string, url: string) {
	// Dispose of the existing webview if it exists
	if (activeWebviewPanel) {
		activeWebviewPanel.dispose();
	}

	// Create a new webview panel
	activeWebviewPanel = vscode.window.createWebviewPanel(
		'livePreview',
		title,
		// vscode.ViewColumn.One,
		vscode.ViewColumn.Beside,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		}
	);

	activeWebviewPanel.webview.html = getWebviewContent(url);

	// Handle disposal of the panel
	activeWebviewPanel.onDidDispose(() => {
		activeWebviewPanel = null;
	}, null);
}

function getWebviewContent(url: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
</head>
<body>
  <iframe src="${url}" frameborder="0" style="width: 100%; height: 100vh;"></iframe>
</body>
</html>`;
}

export function registerLivePreviewsGradio(context: vscode.ExtensionContext) {

	const startPreview = async (rootDir: string, title: string) => {
		try {
			if (gradioServer) {
				// Stop the existing server
				console.log('Stopping existing Gradio server...');
				gradioServer.kill();
				gradioServer = null;
			}

			console.log('Initializing Gradio server...');
			gradioServer = await startGradioServer(rootDir) as ChildProcess;

			console.log('Creating Webview...');
			createWebview(title, `http://localhost:${PORT}`);
		} catch (error) {
			console.error('Failed to start preview:', error);
		}
	};

	context.subscriptions.push(
		vscode.commands.registerCommand(
			`yutools.previews.startGradioPreview`,
			() => startPreview('C:\\ai\\fulled-templates\\gradio-app', 'Gradio App Preview')
		)
	);

	// Add deactivate function to close server on extension deactivation
	context.subscriptions.push({
		dispose() {
			if (gradioServer) {
				console.log('Closing Gradio server...');
				gradioServer.kill();
			}
		}
	});
}
