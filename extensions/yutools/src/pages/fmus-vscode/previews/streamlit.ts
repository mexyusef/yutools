import * as vscode from 'vscode';
import { extension_name } from '../common';
import { exec, spawn, ChildProcess } from 'child_process';

const PORT = 8251;
let streamlitServer: ChildProcess | null = null;
let activeWebviewPanel: vscode.WebviewPanel | null = null;

async function startStreamlitServer(rootDir: string) {
	try {

		// return gradioServer;
		console.log(`Starting Streamlit server for ${rootDir}...`);
		streamlitServer = spawn('streamlit', ['run', 'app.py'], {
			cwd: rootDir,
			env: { ...process.env, PORT: PORT.toString() },
			shell: true,
		});


		if (streamlitServer) {
			streamlitServer.stdout?.on('data', (data) => {
				console.log(`Streamlit server output: ${data}`);
			});

			streamlitServer.stderr?.on('data', (data) => {
				console.error(`Streamlit server error: ${data}`);
			});

			streamlitServer.on('close', (code) => {
				console.log(`Streamlit server exited with code ${code}`);
			});
		} else {
			console.error('Failed to start Gradio server');
			return null;
		}


		return streamlitServer;
	} catch (error) {
		console.error('Failed to start Streamlit server:', error);
		throw error;
	}

}

export function registerLivePreviewsStreamlit(context: vscode.ExtensionContext) {
	const startPreview = async (rootDir: string, title: string) => {
		try {
			if (streamlitServer) {
				// Stop the existing server
				console.log('Stopping existing Streamlit server...');
				streamlitServer.kill();
				streamlitServer = null;
			}

			console.log('Initializing Streamlit server...');
			streamlitServer = await startStreamlitServer(rootDir);

			console.log('Creating Webview...');
			createWebview(title, `http://localhost:${PORT}`);
		} catch (error) {
			console.error('Failed to start preview:', error);
		}
	};

	context.subscriptions.push(
		vscode.commands.registerCommand(
			`yutools.previews.startStreamlitPreview`,
			() => startPreview('C:\\ai\\fulled-templates\\streamlit-app', 'Streamlit App Preview')
		)
	);

	// Add deactivate function to close server on extension deactivation
	context.subscriptions.push({
		dispose() {
			if (streamlitServer) {
				console.log('Closing Streamlit server...');
				streamlitServer.kill();
			}
		}
	});
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
