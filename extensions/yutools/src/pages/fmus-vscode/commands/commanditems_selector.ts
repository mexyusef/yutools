import * as vscode from 'vscode';
import { commandItems } from '../common';

export const commanditems_selector = vscode.commands.registerCommand(`yutools.commanditems_selector`, async () => {
	const selectedItem = await vscode.window.showQuickPick(commandItems, {
		placeHolder: 'FMUS command selection: select or type to filter...'
	});
	if (selectedItem) {
		await vscode.commands.executeCommand(selectedItem.command);
	}
});
