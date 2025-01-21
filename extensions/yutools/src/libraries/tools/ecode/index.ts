import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

const ecodePath = 'c:\\bin\\ecode\\ecode.exe';

function openWithEcode(targetPath: string) {
	exec(`"${ecodePath}" "${targetPath}"`, (error, stdout, stderr) => {
		if (error) {
			vscode.window.showErrorMessage(`Failed to open with Ecode: ${stderr}`);
		}
	});
}

export function register_ecode_commands(context: vscode.ExtensionContext) {
	let openFolderCommand = vscode.commands.registerCommand('yutools.tools.ecode.openFolderWithEcode', async () => {
		const folderUri = await vscode.window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: 'Open Folder with Ecode'
		});

		if (folderUri && folderUri[0]) {
			openWithEcode(folderUri[0].fsPath);
		}
	});

	let openFileCommand = vscode.commands.registerCommand('yutools.tools.ecode.openFileWithEcode', async () => {
		const fileUri = await vscode.window.showOpenDialog({
			canSelectFiles: true,
			canSelectFolders: false,
			canSelectMany: false,
			openLabel: 'Open File with Ecode'
		});

		if (fileUri && fileUri[0]) {
			openWithEcode(fileUri[0].fsPath);
		}
	});

	context.subscriptions.push(openFolderCommand, openFileCommand);
}
