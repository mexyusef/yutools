import * as vscode from 'vscode';

export const openHelpFile = vscode.commands.registerCommand(`yutools.openHelpFile`, () => {
	const filePath = 'C:\\Users\\usef\\work\\sidoarjo\\schnell\\app\\llmutils\\servers\\static\\HELP.md';
	vscode.workspace.openTextDocument(filePath).then(doc => {
		vscode.window.showTextDocument(doc);
	});
});
