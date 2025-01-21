import * as vscode from 'vscode';
import * as path from 'path';
import { getCurrentProjectFolder } from '../utilities/getCurrentProjectFolder';

export const open_filepath_in_editor = vscode.commands.registerCommand(`yutools.open_filepath_in_editor`, async () => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const selection = editor.selection;
		const line = document.lineAt(selection.active.line);
		let filePath = line.text.trim();
		if (!path.isAbsolute(filePath)) {
			filePath = path.join(getCurrentProjectFolder(), filePath);
		}
		try {
			const dirPath = path.dirname(filePath);
			await vscode.workspace.fs.createDirectory(vscode.Uri.file(dirPath));
			const fileUri = vscode.Uri.file(filePath);
			try {
				await vscode.workspace.fs.stat(fileUri);
			} catch (error) {
				if (error instanceof vscode.FileSystemError && error.message.includes('FileNotFound')) {
					await vscode.workspace.fs.writeFile(fileUri, new Uint8Array());
				} else {
					throw error;
				}
			}
			const fileDocument = await vscode.workspace.openTextDocument(fileUri);
			await vscode.window.showTextDocument(fileDocument);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Failed to open or create file ${filePath}: ${error.message}`);
		}
	}
});
