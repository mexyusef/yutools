import * as vscode from 'vscode';
import { extension_name } from '../constants';

export function searchGoogle(query: string): void {
	searchWithUrl(query, 'https://www.google.com/search?q=');
}

export function searchYouTube(query: string): void {
	searchWithUrl(query, 'https://www.youtube.com/results?search_query=');
}

export function searchGitHub(query: string): void {
	searchWithUrl(query, 'https://github.com/search?q=');
}

export function searchStackOverflow(query: string): void {
	searchWithUrl(query, 'https://stackoverflow.com/search?q=');
}

function searchWithUrl(query: string, baseUrl: string): void {
	if (!query) {
		vscode.window.showErrorMessage('Please provide a search query.');
		return;
	}

	const encodedQuery = encodeURIComponent(query);
	const url = `${baseUrl}${encodedQuery}`;

	vscode.env.openExternal(vscode.Uri.parse(url))
		.then(
			success => {
				if (success) {
					vscode.window.showInformationMessage(`Search initiated for: ${query}`);
				} else {
					vscode.window.showErrorMessage('Failed to open browser for search.');
				}
			},
			error => {
				vscode.window.showErrorMessage(`Error opening browser: ${error.message}`);
			}
		);
}

// Example of how to use these functions in your extension
export function register_search_menu(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand(`${extension_name}.searchGoogle`, async () => {
			const query = await vscode.window.showInputBox({
				prompt: 'Enter your Google search query',
				placeHolder: 'Search Google...'
			});
			if (query) { searchGoogle(query); }
		}),
		vscode.commands.registerCommand(`${extension_name}.searchYouTube`, async () => {
			const query = await vscode.window.showInputBox({
				prompt: 'Enter your YouTube search query',
				placeHolder: 'Search YouTube...'
			});
			if (query) { searchYouTube(query); }
		}),
		vscode.commands.registerCommand(`${extension_name}.searchGitHub`, async () => {
			const query = await vscode.window.showInputBox({
				prompt: 'Enter your GitHub search query',
				placeHolder: 'Search GitHub...'
			});
			if (query) { searchGitHub(query); }
		}),
		vscode.commands.registerCommand(`${extension_name}.searchStackOverflow`, async () => {
			const query = await vscode.window.showInputBox({
				prompt: 'Enter your Stack Overflow search query',
				placeHolder: 'Search Stack Overflow...'
			});
			if (query) { searchStackOverflow(query); }
		})
	);
}
