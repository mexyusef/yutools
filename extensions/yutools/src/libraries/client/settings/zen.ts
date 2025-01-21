import * as vscode from 'vscode';

const toggleZenModeCommand = vscode.commands.registerCommand(
	'yutools.toggleZenMode',
	() => {
		// Toggle Zen Mode (enter or exit)
		vscode.commands.executeCommand('workbench.action.toggleZenMode');
	}
);

export function register_zen_mode(context: vscode.ExtensionContext) {
	context.subscriptions.push(toggleZenModeCommand);
}
