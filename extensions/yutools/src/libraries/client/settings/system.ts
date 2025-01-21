import * as vscode from "vscode";

// this.commandService.executeCommand("workbench.action.quit"),
const closeVscodeWindow = vscode.commands.registerCommand("yutools.closeVscodeWindow",
	async () => {
		await vscode.commands.executeCommand("workbench.action.quit");
	}
);

const listCommands = vscode.commands.registerCommand('yutools.listCommands',
	async () => {
		const allCommands = await vscode.commands.getCommands();
		vscode.window.showQuickPick(allCommands, {
			placeHolder: 'List of all commands',
			canPickMany: false
		});
	}
);

export function register_system_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(closeVscodeWindow);
	context.subscriptions.push(listCommands);
}
