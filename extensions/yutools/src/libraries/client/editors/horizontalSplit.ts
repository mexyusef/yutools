import * as vscode from 'vscode';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Opens a document in a new horizontal split (next editor group).
 * If already opened, it focuses the document in the specified group.
 *
 * @param document The document to open
 * @returns A promise resolving to the opened text editor
 */
export async function openInHorizontalSplit(document: vscode.TextDocument): Promise<vscode.TextEditor | undefined> {
    return vscode.window.showTextDocument(document, vscode.ViewColumn.Two);
}


/**
 * Splits the current editor horizontally using a VS Code command.
 *
 * @returns A promise that resolves when the split command is executed
 */
export async function splitCurrentEditorHorizontally(): Promise<void> {
    await vscode.commands.executeCommand('workbench.action.splitEditorOrthogonal');
}

/**
 * Opens a file in a horizontal split.
 * If the file is not open, it opens it in the second column.
 *
 * @param uri The URI of the file to open
 * @returns A promise resolving to the opened text editor
 */
export async function openFileInHorizontalSplit(uri: vscode.Uri): Promise<vscode.TextEditor | undefined> {
    const document = await vscode.workspace.openTextDocument(uri);
    return openInHorizontalSplit(document);
}

/**
 * Adjusts user settings to prefer horizontal splits when opening editors side by side.
 * This modifies the `workbench.editor.openSideBySideDirection` setting to `right`.
 *
 * @returns A promise that resolves when the settings are updated
 */
export async function setHorizontalSplitPreference(): Promise<void> {
    const config = vscode.workspace.getConfiguration('workbench.editor');
    await config.update('openSideBySideDirection', 'right', vscode.ConfigurationTarget.Global);
}

/**
 * Creates a new untitled file in a horizontal split.
 *
 * @returns A promise resolving to the created text editor
 */
export async function createUntitledFileInHorizontalSplit(): Promise<vscode.TextEditor | undefined> {
    const document = await vscode.workspace.openTextDocument({ language: 'plaintext', content: '' });
    return openInHorizontalSplit(document);
}

/**
 * Opens a specific editor in a specified group, creating the group if needed.
 *
 * @param document The document to open
 * @param viewColumn The target view column
 * @returns A promise resolving to the opened text editor
 */
export async function openInSpecificGroup(document: vscode.TextDocument, viewColumn: vscode.ViewColumn): Promise<vscode.TextEditor | undefined> {
    return vscode.window.showTextDocument(document, viewColumn);
}

/**
 * Utility to split the current editor horizontally and open a specific file.
 * If the file is already open, it focuses the editor.
 *
 * @param filePath The absolute path of the file to open
 * @returns A promise resolving to the opened text editor
 */
export async function splitAndOpenFile(filePath: string): Promise<vscode.TextEditor | undefined> {
    const uri = vscode.Uri.file(filePath);
    await splitCurrentEditorHorizontally();
    return openFileInHorizontalSplit(uri);
}

/**
 * Ensures a document is opened in a horizontal layout by moving it to the second column.
 *
 * @param document The document to move
 * @returns A promise that resolves when the document is moved
 */
export async function ensureHorizontalLayout(document: vscode.TextDocument): Promise<vscode.TextEditor | undefined> {
    return vscode.window.showTextDocument(document, vscode.ViewColumn.Two);
}

/**
 * Registers a command to create a new untitled editor in the bottom split.
 *
 * @param context The extension context to register the command
 */
// export function registerCreateUntitledEditorBottomCommand(context: vscode.ExtensionContext): void {
//     context.subscriptions.push(
//         vscode.commands.registerCommand('yutools.createUntitledEditorBottom', async () => {
//             await createUntitledFileInHorizontalSplit();
//         })
//     );
// }


export const createUntitledEditorBottom = vscode.commands.registerCommand(
    'yutools.createUntitledEditorBottom',
    async () => {
        await createUntitledFileInHorizontalSplit();
    }
);
