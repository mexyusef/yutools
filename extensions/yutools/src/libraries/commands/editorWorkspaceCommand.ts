import * as vscode from 'vscode';
import { openInWorkspace } from '../client/editors/workspace';

/**
 * Command handler for the "openInWorkspace" command.
 *
 * @param resource - The resource URI provided by the Explorer context menu.
 */
export async function openInWorkspaceCommand(resource: vscode.Uri): Promise<void> {
    if (!resource) {
        vscode.window.showErrorMessage('No file or directory selected.');
        return;
    }
    await openInWorkspace(resource.fsPath);
}

/**
 * Activates the VSCode extension.
 *
 * @param context - The VSCode extension context.
 */
export const openInWorkspaceCmd = vscode.commands.registerCommand(
    'yutools.openInWorkspace',
    openInWorkspaceCommand
);
