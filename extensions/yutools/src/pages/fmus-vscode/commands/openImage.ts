import * as vscode from 'vscode';

export const openImage = vscode.commands.registerCommand(`yutools.images.openImage`, (imgPath: string) => {
	vscode.commands.executeCommand('vscode.open', vscode.Uri.file(imgPath));
});
