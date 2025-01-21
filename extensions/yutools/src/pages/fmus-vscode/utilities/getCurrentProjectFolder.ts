import * as vscode from 'vscode';

/**
 * Get the current project folder from the configuration.
 * @returns The current project folder path.
 */
export function getCurrentProjectFolder(): string {
	const configuration = vscode.workspace.getConfiguration();
	let currentFolder = configuration.get<string>(`yutools.currentProjectFolder`);

	// Default to current working directory if no folder is set
	if (!currentFolder) {
		currentFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
	}

	return currentFolder;
}
