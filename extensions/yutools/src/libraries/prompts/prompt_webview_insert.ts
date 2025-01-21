import { window, commands, ExtensionContext, WebviewPanel, ViewColumn, Uri } from 'vscode';
import * as vscode from 'vscode';
import { getAllPrompts } from './redisUtils';
import { Prompt } from './types';

let webviewPanel: WebviewPanel | undefined;
let lastActiveEditor: vscode.TextEditor | undefined;

export const viewPromptsCommandWebviewWithInsert = commands.registerCommand('prompt.viewWebviewWithInsert', async () => {
	// Store the last active editor
	lastActiveEditor = window.activeTextEditor;
	console.log('Last active editor:', lastActiveEditor?.document.fileName);
	if (webviewPanel) {
		webviewPanel.reveal();
		return;
	}

	webviewPanel = window.createWebviewPanel(
		'promptView',
		'View Prompts',
		ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		}
	);

	const prompts = await getAllPrompts();
	webviewPanel.webview.html = getWebviewContent(prompts);

	webviewPanel.onDidDispose(() => {
		webviewPanel = undefined;
	});

	webviewPanel.webview.onDidReceiveMessage(async (message) => {
		console.log('Message received:', message); // Log the received message
		switch (message.command) {
			case 'navigate':
				console.log('Navigating to page:', message.page);
				const updatedPrompts = await getAllPrompts();
				webviewPanel!.webview.html = getWebviewContent(updatedPrompts, message.page);
				break;
			case 'insert':
				console.log('Inserting content:', message.content);
				if (lastActiveEditor) {
					lastActiveEditor.edit((editBuilder) => {
						editBuilder.insert(lastActiveEditor!.selection.active, message.content);
					});
					window.showInformationMessage(`Prompt inserted!`);
				} else {
					window.showErrorMessage('No active editor found.');
				}
				break;
		}
	});

});

function getWebviewContent(prompts: Prompt[], page: number = 1): string {
	// Sort prompts by createdAt (newest first)
	const sortedPrompts = prompts.sort((a, b) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	const itemsPerPage = 10;
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedPrompts = sortedPrompts.slice(startIndex, endIndex);

	const tableRows = paginatedPrompts
		.map(
			(p) => `
			<tr class="glass-card">
					<td>${p.title}</td>
					<td>${p.tags.join(', ')}</td>
					<td>${new Date(p.createdAt).toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})}</td>
					<td>${new Date(p.updatedAt).toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})}</td>
					<td><pre>${p.content}</pre></td>
					<td>
							<button class="insert-button" onclick="insertPrompt(${JSON.stringify(
				p.content.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
			)})">Insert</button>
					</td>
			</tr>
	`
		)
		.join('');

	// console.log(tableRows); // Log the generated HTML for debugging
	console.log('Generated table rows:', tableRows); // Log the generated HTML for debugging
	const pagination = `
			<div class="pagination">
					<button onclick="navigate(${page - 1})" ${page === 1 ? 'disabled' : ''}>Previous</button>
					<span>Page ${page}</span>
					<button onclick="navigate(${page + 1})" ${endIndex >= sortedPrompts.length ? 'disabled' : ''
		}>Next</button>
			</div>
	`;

	return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>View Prompts</title>
					<style>
							body {
									font-family: 'Arial', sans-serif;
									background: linear-gradient(135deg, #1e1e2f, #2a2a40);
									color: #fff;
									padding: 20px;
									margin: 0;
							}
							h1 {
									text-align: center;
									font-size: 2.5rem;
									background: linear-gradient(90deg, #ff7e5f, #feb47b);
									-webkit-background-clip: text;
									-webkit-text-fill-color: transparent;
									margin-bottom: 20px;
							}
							table {
									width: 100%;
									border-collapse: collapse;
									margin-bottom: 20px;
							}
							th, td {
									padding: 15px;
									text-align: left;
									border-bottom: 1px solid rgba(255, 255, 255, 0.1);
							}
							th {
									background: linear-gradient(135deg, #ff7e5f, #feb47b);
									color: #fff;
									font-weight: bold;
							}
							.glass-card {
									background: rgba(255, 255, 255, 0.1);
									backdrop-filter: blur(10px);
									border-radius: 10px;
									margin: 10px 0;
									transition: transform 0.3s ease, box-shadow 0.3s ease;
							}
							.glass-card:hover {
									transform: translateY(-5px);
									box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
							}
							pre {
									margin: 0;
									font-family: 'Courier New', monospace;
									white-space: pre-wrap;
									word-wrap: break-word;
							}
							.pagination {
									display: flex;
									justify-content: center;
									align-items: center;
									margin-top: 20px;
							}
							.pagination button {
									background: linear-gradient(135deg, #ff7e5f, #feb47b);
									border: none;
									color: #fff;
									padding: 10px 20px;
									margin: 0 10px;
									border-radius: 5px;
									cursor: pointer;
									transition: opacity 0.3s ease;
							}
							.pagination button:disabled {
									opacity: 0.5;
									cursor: not-allowed;
							}
							.pagination button:hover:not(:disabled) {
									opacity: 0.8;
							}
							.pagination span {
									font-size: 1.2rem;
									margin: 0 10px;
							}
							.insert-button {
									background: linear-gradient(135deg, #00c6ff, #0072ff);
									border: none;
									color: #fff;
									padding: 8px 16px;
									border-radius: 5px;
									cursor: pointer;
									transition: opacity 0.3s ease;
							}
							.insert-button:hover {
									opacity: 0.8;
							}
					</style>
			</head>
			<body>
					<h1>View Prompts</h1>
					<table>
							<thead>
									<tr>
											<th>Title</th>
											<th>Tags</th>
											<th>Created</th>
											<th>Last Updated</th>
											<th>Content</th>
									</tr>
							</thead>
							<tbody>
									${tableRows}
							</tbody>
					</table>
					${pagination}
				<script>
						const vscode = acquireVsCodeApi();
						function navigate(page) {
								vscode.postMessage({ command: 'navigate', page });
						}
						function insertPrompt(content) {
								console.log('Content to insert:', content); // Log the content being passed
								vscode.postMessage({ command: 'insert', content });
						}
				</script>
			</body>
			</html>
	`;
}
