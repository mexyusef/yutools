import * as vscode from 'vscode';

export function register_builtin_vscode_commands(context: vscode.ExtensionContext) {

	// Register a command for your extension
	const showSymbolsInFile = vscode.commands.registerCommand('yutools.showSymbolsInFile', async () => {
		try {
			// Execute the "Go to Symbol" command
			await vscode.commands.executeCommand('workbench.action.gotoSymbol');
		} catch (err) {
			vscode.window.showErrorMessage('Failed to show symbols: ' + err);
		}
	});

	context.subscriptions.push(showSymbolsInFile);

	// Register a command for your extension
	const toggleMaximizedPanel = vscode.commands.registerCommand('yutools.toggleMaximizedPanel', async () => {
		try {
			// Execute the Toggle Maximized Panel command
			await vscode.commands.executeCommand('workbench.action.toggleMaximizedPanel');
		} catch (err) {
			vscode.window.showErrorMessage('Failed to toggle maximized panel: ' + err);
		}
	});

	context.subscriptions.push(toggleMaximizedPanel);
}
