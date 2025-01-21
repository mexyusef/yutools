import * as vscode from 'vscode';
// import { extension_name } from '../common';

import { createServer } from 'vite';
import { exec } from 'child_process';
const path = require('path');
const PORT = 8201;
const PORT_NEXTJS = 8210;
// const PORT_NEXTTS = 8211;

let server: any;

async function startNextJsServer(rootDir: string) {
	return new Promise((resolve, reject) => {
		// const server = exec('npx next dev', { cwd: rootDir });
		const server = exec(`npx next dev -p ${PORT_NEXTJS}`, { cwd: rootDir });

		server.stdout?.on('data', (data: string) => {
			console.log(`Next.js: ${data}`);
			if (data.includes('started server on')) {
				resolve(server);
			}
		});

		server.stderr?.on('data', (data: string) => {
			console.error(`Next.js error: ${data}`);
			reject(data);
		});
	});
}

async function startViteServer(rootDir: string) {
	try {
		console.log(`Starting Vite server for ${rootDir}...`);
		const server = await createServer({
			root: rootDir,
			configFile: path.join(rootDir, 'vite.config.js'),
			server: {
				port: PORT,
				open: false,
				// host: '0.0.0.0', // Ensure server is exposed
			}
		});

		await server.listen();
		console.log(`Vite server is running at http://localhost:${PORT}`);
		server.printUrls();

		return server;
	} catch (error) {
		console.error('Failed to start Vite server:', error);
		throw error; // Re-throw the error to handle it in the calling function
	}
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

export function registerLivePreviewsNextjs(context: vscode.ExtensionContext) {
	const startPreview = async (rootDir: string, title: string, isNextJs: boolean = false) => {
		try {
			if (!server) {
				console.log('Initializing server...');
				server = isNextJs ? await startNextJsServer(rootDir) : await startViteServer(rootDir);
			}
			const alamat = isNextJs ? `http://localhost:${PORT_NEXTJS}` : `http://localhost:${PORT}`;
			console.log(`Creating Webview for ${alamat}...`);
			createWebview(title, alamat);
			// createWebview(title, `http://localhost:${PORT}`);
		} catch (error) {
			console.error('Failed to start preview:', error);
		}
	};

	const commands = [
		{ command: `yutools.previews.startNextPreview`, rootDir: 'C:\\ai\\fulled-templates\\next-app', title: 'Next.js🌺Preview', isNextJs: true },
	];

	commands.forEach(({ command, rootDir, title, isNextJs = false }) => {
		context.subscriptions.push(
			vscode.commands.registerCommand(command, () => startPreview(rootDir, title, isNextJs))
		);
	});

	context.subscriptions.push({
		dispose() {
			if (server) {
				console.log('Closing Vite server...');
				server.close();
			}
		}
	});
}
