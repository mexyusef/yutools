import * as vscode from 'vscode';
import { getPromptAndContext } from '../../../handlers/commands/vendor';

export const showWebPage = vscode.commands.registerCommand(`yutools.showWebPage`, async () => {
	const { prompt, context } = await getPromptAndContext();
	let url = prompt as string;
	if (!url) {
		vscode.window.showErrorMessage('No URL provided.');
		return;
	}
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		url = 'http://' + url;
	}
	showWebview(url);
});

export const open_web_page = vscode.commands.registerCommand(`yutools.open_web_page`, async (url: string | undefined = undefined) => {
	if (!url) {
		const { prompt, context } = await getPromptAndContext();
		url = prompt as string;
		if (!url) {
			vscode.window.showErrorMessage('No URL provided.');
			return;
		}
	}
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		url = 'http://' + url;
	}
	await openWebpage(url);
});

async function openWebpage(url: string) {
	// const encodedQuery = encodeURIComponent(query);
	// const googleSearchUrl = `https://www.google.com/search?q=${encodedQuery}`;
	await vscode.env.openExternal(vscode.Uri.parse(url));
}

function showWebview(url: string) {
	const panel = vscode.window.createWebviewPanel(
		'webview',
		'Webview',
		vscode.ViewColumn.Beside,
		{
			enableScripts: true
		}
	);

	panel.webview.html = getWebviewContent(url);
}

function getWebviewContent(url: string) {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webview</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            padding: 0;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="${url}"></iframe>
</body>
</html>`;
}

export function registerLocalhost(context: vscode.ExtensionContext) {
	context.subscriptions.push(showWebPage);

	context.subscriptions.push(open_web_page);

	context.subscriptions.push(vscode.commands.registerCommand(`yutools.localhost3`, () => { showWebview('http://localhost:3000'); }));

	context.subscriptions.push(vscode.commands.registerCommand(`yutools.localhost4`, () => { showWebview('http://localhost:4000'); }));

	context.subscriptions.push(vscode.commands.registerCommand(`yutools.localhost5`, () => { showWebview('http://localhost:5000'); }));

	context.subscriptions.push(vscode.commands.registerCommand(`yutools.localhost6`, () => { showWebview('http://localhost:6000'); }));

	context.subscriptions.push(vscode.commands.registerCommand(`yutools.localhost7`, () => { showWebview('http://localhost:7000'); }));

	context.subscriptions.push(vscode.commands.registerCommand(`yutools.localhost8`, () => { showWebview('http://localhost:8000'); }));

	context.subscriptions.push(vscode.commands.registerCommand(`yutools.localhost9`, () => { showWebview('http://localhost:9000'); }));
}
