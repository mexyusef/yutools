import * as vscode from 'vscode';
import { extension_name } from '../common';
import * as cp from 'child_process';

const PORT = 8220;
const ROOTDIR = 'C:\\ai\\fulled-templates\\vue-app';

let serverProcess: cp.ChildProcess | null = null;
let serverTerminal: vscode.Terminal | null = null;

function stopTerminalReact() {
	if (serverProcess) {
		serverProcess.kill();
		serverProcess = null;
		vscode.window.showInformationMessage('Vue app server stopped.');
	} else {
		vscode.window.showWarningMessage('No Vue app server is currently running.');
	}
}

function startTerminalReact() {
	// const workspaceFolders = vscode.workspace.workspaceFolders;
	// if (!workspaceFolders) {
	//     vscode.window.showErrorMessage('No workspace folder open');
	//     return;
	// }
	// const rootPath = workspaceFolders[0].uri.fsPath;
	// const reactAppPath = ROOTDIR; // path.join(rootPath, 'react-app'); // Adjust this path as needed

	// const terminal = vscode.window.createTerminal('React App Server');
	// terminal.sendText(`cd "${ROOTDIR}"`);
	// terminal.sendText('npx vite');
	// terminal.show();
	// vscode.window.showInformationMessage('React app server started. Check the terminal for details.');
	if (serverProcess) {
		vscode.window.showWarningMessage('Vue app server is already running.');
		return;
	}
	// const workspaceFolders = vscode.workspace.workspaceFolders;
	// if (!workspaceFolders) {
	//     vscode.window.showErrorMessage('No workspace folder open');
	//     return;
	// }
	// const rootPath = workspaceFolders[0].uri.fsPath;
	// const reactAppPath = ROOTDIR; // path.join(rootPath, 'react-app'); // Adjust this path as needed
	serverTerminal = vscode.window.createTerminal('Vue App Server');
	serverTerminal.sendText(`cd "${ROOTDIR}"`);

	serverProcess = cp.spawn('npx', ['vite'], {
		cwd: ROOTDIR,
		shell: true
	});

	serverProcess.stdout?.on('data', (data) => {
		console.log(`stdout: ${data}`);
		if (data.toString().includes('Local:')) {
			const url = data.toString().match(/Local:\s+(http:\/\/[\w.:]+)/);
			if (url && url[1]) {
				vscode.window.showInformationMessage(`Vue app is running at ${url[1]}`, 'Open in Browser').then(selection => {
					if (selection === 'Open in Browser') {
						vscode.env.openExternal(vscode.Uri.parse(url[1]));
					}
				});
			}
		}
	});

	serverProcess.stderr?.on('data', (data) => {
		console.error(`stderr: ${data}`);
	});

	serverProcess.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		serverProcess = null;
		if (serverTerminal) {
			serverTerminal.dispose();
			serverTerminal = null;
		}
	});

	if (serverTerminal) {
		serverTerminal.show();
	}
	vscode.window.showInformationMessage('Vue app server started. Check the terminal for details.');
}

function createWebview(title: string, url: string) {
	const panel = vscode.window.createWebviewPanel(
		'livePreview',
		title,
		// vscode.ViewColumn.One,
		vscode.ViewColumn.Beside,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		}
	);

	panel.webview.html = getWebviewContent(url, title);
}

function getWebviewContent(url: string, title: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <iframe src="${url}" frameborder="0" style="width: 100%; height: 100vh;"></iframe>
</body>
</html>`;
}

export function registerLivePreviewsVuejsJavascript(context: vscode.ExtensionContext) {

	const startPreview = async (rootDir: string, title: string, isNextJs: boolean = false) => {
		try {
			if (!serverProcess) {
				startTerminalReact();
			} else {
				stopTerminalReact();
			}
			const alamat = `http://localhost:${PORT}`;
			console.log(`Creating Webview for ${alamat}...`);
			createWebview(title, alamat);
			// createWebview(title, `http://localhost:${PORT}`);
		} catch (error) {
			console.error('Failed to start preview:', error);
		}
	};

	const commands = [
		{ command: `yutools.previews.startVuePreview`, rootDir: ROOTDIR, title: 'Vue🌟Preview', isNextJs: false }

	];

	commands.forEach(({ command, rootDir, title, isNextJs = false }) => {
		context.subscriptions.push(
			vscode.commands.registerCommand(command, () => startPreview(rootDir, title, isNextJs))
		);
	});

	context.subscriptions.push({
		dispose() {
			stopTerminalReact();
		}
	});
}
