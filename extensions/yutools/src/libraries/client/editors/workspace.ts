import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Opens a given path (file or directory) in a new workspace.
 *
 * @param filePath - The file or directory path to open.
 * @param forceNewWindow - Whether to force opening in a new window.
 */
export async function openPathInWorkspace(
    filePath: string,
    forceNewWindow: boolean = true
): Promise<void> {
    try {
        const targetPath = await resolveToDirectory(filePath);
        await vscode.commands.executeCommand(
            'vscode.openFolder',
            vscode.Uri.file(targetPath),
            forceNewWindow
        );
    } catch (error: any) {
        throw new Error(`Failed to open path in workspace: ${error.message}`);
    }
}


/**
 * Determines if the given path is a directory.
 *
 * @param filePath - The file or directory path to check.
 * @returns True if the path is a directory, false otherwise.
 */
export async function isDirectory(filePath: string): Promise<boolean> {
    try {
        const fileStat = await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
        return fileStat.type === vscode.FileType.Directory;
    } catch (error: any) {
        throw new Error(`Unable to check path type: ${error.message}`);
    }
}

/**
 * Resolves a given path to a directory. If the path is a file, its parent directory is returned.
 *
 * @param filePath - The file or directory path.
 * @returns The resolved directory path.
 */
export async function resolveToDirectory(filePath: string): Promise<string> {
    try {
        const isADirectory = await isDirectory(filePath);
        return isADirectory ? filePath : path.dirname(filePath);
    } catch (error: any) {
        throw new Error(`Failed to resolve directory: ${error.message}`);
    }
}

/**
 * Gets the current workspace folder URIs.
 *
 * @returns An array of workspace folder URIs.
 */
export function getWorkspaceFolders(): vscode.Uri[] {
    return vscode.workspace.workspaceFolders?.map(folder => folder.uri) || [];
}

/**
 * Adds a folder to the current workspace.
 *
 * @param folderPath - The folder path to add to the workspace.
 */
export async function addFolderToWorkspace(folderPath: string): Promise<void> {
    const uri = vscode.Uri.file(folderPath);
    vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length || 0, null, { uri });
}

/**
 * Removes a folder from the current workspace.
 *
 * @param folderPath - The folder path to remove from the workspace.
 */
export async function removeFolderFromWorkspace(folderPath: string): Promise<void> {
    const uri = vscode.Uri.file(folderPath);
    const workspaceFolders = vscode.workspace.workspaceFolders || [];
    const index = workspaceFolders.findIndex(folder => folder.uri.fsPath === uri.fsPath);

    if (index >= 0) {
        vscode.workspace.updateWorkspaceFolders(index, 1);
    }
}


// import { openPathInWorkspace } from '../utils/workspaceUtils';

/**
 * Opens a file or directory in a new VSCode workspace.
 *
 * @param filePath - The file or directory path to open.
 */
export async function openInWorkspace(filePath: string): Promise<void> {
    try {
        await openPathInWorkspace(filePath, true);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to open in workspace: ${error.message}`);
    }
}


/**
 * Opens a URL in the default browser using VSCode's built-in command.
 *
 * @param url - The URL to open.
 */
export async function openExternalUrl(url: string): Promise<void> {
    if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL provided.');
    }

    try {
        await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
    } catch (error: any) {
        throw new Error(`Failed to open URL: ${error.message}`);
    }
}
// vscode.commands.registerCommand('links.discord', async () => {
//     try {
//         // Redirect to Discord server link
//         await openExternalUrl('https://discord.gg/abc');
//     } catch (error: any) {
//         vscode.window.showErrorMessage(error.message);
//     }
// });

