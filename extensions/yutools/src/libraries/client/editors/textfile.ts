import * as vscode from 'vscode';

const createNewTextFile = vscode.commands.registerCommand('yutools.createNewTextFile',
	async () => {
		try {
			// Create a new untitled document
			const document = await vscode.workspace.openTextDocument({ language: 'plaintext' });
			// Show the document in the active editor
			await vscode.window.showTextDocument(document);
		} catch (error) {
			vscode.window.showErrorMessage('Failed to create a new untitled text file.');
			console.error(error);
		}
	});

export function register_textfile_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(createNewTextFile);
}
