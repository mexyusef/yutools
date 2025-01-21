import * as vscode from 'vscode';
// import * as fs from 'fs';
import * as path from 'path';
import { FileSearcher } from './fileSearcher';
import { JSONFileUtils } from './jsonFileUtils';

// 'yutools.fileUtilsSearchFiles',
// 'yutools.jsonUtilsModifyJson',
export function register_fileutils_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('yutools.fileUtilsSearchFiles',
			async (uri: vscode.Uri) => {
				if (!uri) {
					vscode.window.showErrorMessage('Please invoke this command from the Explorer context menu.');
					return;
				}

				const baseFolder = uri.fsPath;
				const pattern = await vscode.window.showInputBox({
					prompt: 'Enter file name pattern (e.g., ".ts" or "config")',
					placeHolder: 'File pattern to search',
				});

				if (!pattern) {
					vscode.window.showWarningMessage('Search aborted. No pattern was provided.');
					return;
				}

				try {
					const matches = await FileSearcher.findFiles(baseFolder, pattern);
					if (matches.length === 0) {
						vscode.window.showInformationMessage(`No files matching "${pattern}" found.`);
					} else {
						const items = matches.map((file) => ({
							label: path.basename(file),
							description: file,
						}));

						const selected = await vscode.window.showQuickPick(items, {
							placeHolder: 'Select a file to open',
						});

						if (selected) {
							const document = await vscode.workspace.openTextDocument(selected.description);
							await vscode.window.showTextDocument(document);
						}
					}
				} catch (error: any) {
					vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
				}
			}
		)
	);
}

export function register_jsonutils_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('yutools.jsonUtilsModifyJson',
			async (uri: vscode.Uri) => {
				if (!uri) {
					vscode.window.showErrorMessage('Please invoke this command from the Explorer context menu.');
					return;
				}
				const filePath = uri.fsPath;
				const jsonUtils = new JSONFileUtils(filePath);
				const action = await vscode.window.showQuickPick(['Get', 'Set', 'Delete', 'Print'], {
					placeHolder: 'Choose an action to perform on the JSON file.',
				});
				if (!action) {
					vscode.window.showWarningMessage('No action selected. Command aborted.');
					return;
				}
				try {
					switch (action) {
						case 'Get': {
							const keysInput = await vscode.window.showInputBox({
								prompt: 'Enter the JSON path to get (dot-separated, e.g., "parent.child.key")',
							});
							if (!keysInput) {
								vscode.window.showWarningMessage('No path provided.');
								return;
							}
							const keys = keysInput.split('.');
							const value = jsonUtils.get()[keysInput];
							vscode.window.showInformationMessage(`Value: ${JSON.stringify(value, null, 4)}`);
							break;
						}

						case 'Set': {
							const keysInput = await vscode.window.showInputBox({
								prompt: 'Enter the JSON path to set (dot-separated, e.g., "parent.child.key")',
							});

							const valueInput = await vscode.window.showInputBox({
								prompt: 'Enter the value to set (JSON format)',
							});

							if (!keysInput || !valueInput) {
								vscode.window.showWarningMessage('Path or value missing. Command aborted.');
								return;
							}
							const keys = keysInput.split('.');
							const value = JSON.parse(valueInput);
							jsonUtils.set(keys, value);
							vscode.window.showInformationMessage(`Successfully updated JSON at ${keysInput}.`);
							break;
						}

						case 'Delete': {
							const keysInput = await vscode.window.showInputBox({
								prompt: 'Enter the JSON path to delete (dot-separated, e.g., "parent.child.key")',
							});

							if (!keysInput) {
								vscode.window.showWarningMessage('No path provided.');
								return;
							}

							const keys = keysInput.split('.');
							jsonUtils.delete(keys);
							vscode.window.showInformationMessage(`Successfully deleted JSON entry at ${keysInput}.`);
							break;
						}

						case 'Print': {
							const selector = await vscode.window.showInputBox({
								prompt: 'Enter the JSON path to print (dot-separated, e.g., "parent.child.key")',
							});

							if (!selector) {
								vscode.window.showWarningMessage('No selector provided.');
								return;
							}

							const value = jsonUtils.print(selector);
							vscode.window.showInformationMessage(`Selected JSON: ${JSON.stringify(value, null, 4)}`);
							break;
						}
					}
				} catch (error: any) {
					vscode.window.showErrorMessage(`Error: ${error.message}`);
				}
			}
		)
	);
}
