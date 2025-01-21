import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { getConfigValue } from '../../../configs';

const PORT = getConfigValue<number>('yutools.previews.html.port', 8000);
const ROOTDIR = getConfigValue<string>('yutools.previews.html.rootdir', "c:\\hapus"); // 'C:\\ai\\fulled-templates\\html';

let activeWebviewPanel: vscode.WebviewPanel | null = null;
let serverProcess: child_process.ChildProcess | null = null;

async function killProcessByPort(port: number) {
	try {
		// Use PowerShell command to find and kill process using specified port
		const command = `Get-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess | Stop-Process -Force`;
		await vscode.window.terminals[0].sendText(`powershell.exe ${command}`);
	} catch (error) {
		console.error(`Failed to kill process using port ${port}:`, error);
	}
}

function createWebview(title: string, url: string) {
	if (activeWebviewPanel) {
		activeWebviewPanel.dispose();
	}

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

	activeWebviewPanel.webview.html = getWebviewContent(url, title);

	activeWebviewPanel.onDidDispose(() => {
		activeWebviewPanel = null;
	}, null);
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

const startPreview = async (rootDir: string, title: string) => {
	try {
		await killProcessByPort(PORT);
		console.log('Initializing server...');
		// server = await startViteServer(rootDir);
		// serverProcess = await startViteServer(rootDir);
		// PORT = await getPort({ port: portNumbers(8800, 9000) }); // Adjust range as needed
		console.log(`Starting http-server on port ${PORT}...`);
		const command = `http-server ${rootDir} -p ${PORT}`;
		// const command = `http-server ${rootDir} -p ${PORT}`;
		serverProcess = child_process.exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error('Failed to start http-server:', error);
				return;
			}
			console.log('HTTP server is running at http://localhost:' + PORT);
		});
		console.log('Creating Webview for HTML...');
		createWebview(title, `http://localhost:${PORT}`);
	} catch (error) {
		console.error('Failed to start preview:', error);
	}
};

const startHtmlPreview = vscode.commands.registerCommand(`yutools.previews.startHtmlPreview`, () => startPreview(ROOTDIR, 'HTML Preview'));

export function registerLivePreviewsHTML(context: vscode.ExtensionContext) {

	context.subscriptions.push(startHtmlPreview);

	context.subscriptions.push({
		dispose() {
			if (serverProcess) {
				console.log('Stopping http-server...');
				serverProcess.kill();
				serverProcess = null;
			}
		}
	});

}
