import * as vscode from 'vscode';

export function getBackupFilePath(): string {
	const filePath = vscode.workspace.getConfiguration('myExtension').get('backupFilePath') as string;
	if (!filePath) {
		throw new Error('Backup file path is not configured');
	}
	return filePath;
}
