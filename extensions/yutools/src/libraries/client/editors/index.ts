/* eslint-disable curly */
import * as vscode from 'vscode';
import * as path from 'path';
import { getCurrentWorkingDirectory } from '../settings/configUtils';
import { register_toggle_right_group_commands } from './right_editor_group';
import { register_opened_editors_commands } from './opened_editors';

/**
 * Gets the active text editor or throws an error if none exists.
 */
export const getActiveEditor = (showError: boolean = true): vscode.TextEditor => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        if (showError) {
            vscode.window.showErrorMessage("No active editor found. Please open a file and try again.");
            throw new Error("No active editor");
        }
    }
    return editor as vscode.TextEditor;
};

/**
 * Retrieves the current selection in the active editor.
 */
export const getSelectedText = (): string | undefined => {
    const editor = getActiveEditor();
    const selection = editor.selection;
    return editor.document.getText(selection) || undefined;
};

/**
 * Get the directory path of the active editor's file.
 * Falls back to the current working directory if no editor is active.
 */


export const getEditorDirectoryOrCwd = (): string => {
    try {
        // Attempt to get the file path of the active editor
        const editorContext = getEditorContext();
        const filePath = editorContext.filePath;

        // Check if the file path is valid (not untitled or empty)
        if (filePath && !filePath.startsWith("Untitled")) {
            const editorDirectory = path.dirname(filePath); // Get directory of the file
            console.log(`getEditorDirectoryOrCwd editorDirectory=${editorDirectory}, editorContext=${JSON.stringify(editorContext, null, 2)}`);
            return editorDirectory;
        }

        // If the file path is invalid, fallback to the current working directory
        const cwd = getCurrentWorkingDirectory();
        console.log(`getEditorDirectoryOrCwd fallback to cwd=${cwd}, editorContext=${JSON.stringify(editorContext, null, 2)}`);
        return cwd;
    } catch (error) {
        // If no active editor is found or another error occurs, fallback to the current working directory
        const cwd = getCurrentWorkingDirectory();
        console.log(`getEditorDirectoryOrCwd error fallback to cwd=${cwd}, error=${error}`);
        return cwd;
    }
};

/**
 * Retrieves the full content of the active editor.
 */
export const getEditorContent = (): string => {
    const editor = getActiveEditor();
    return editor.document.getText();
};

/**
 * Gets the current line where the cursor is located.
 */
export const getCurrentLine = (): string | undefined => {
    const editor = getActiveEditor();
    if (!editor) return undefined;
    const line = editor.document.lineAt(editor.selection.active.line);
    return line.text;
};


/**
 * Retrieves the context (e.g., file name and file path) of the active editor.
 */
export const getEditorContext = (): { fileName: string; filePath: string } => {
    const editor = getActiveEditor();
    const document = editor.document;
    return {
        fileName: document.fileName,
        filePath: document.uri.fsPath,
    };
};

/**
 * Gets `n` lines before the current line.
 */
export const getNLinesBefore = (n: number): string[] | undefined => {
    const editor = getActiveEditor();
    if (!editor) return undefined;
    const currentLine = editor.selection.active.line;
    const startLine = Math.max(0, currentLine - n);
    const lines: string[] = [];
    for (let i = startLine; i < currentLine; i++) {
        lines.push(editor.document.lineAt(i).text);
    }
    return lines;
};

/**
 * Gets `n` lines after the current line.
 */
export const getNLinesAfter = (n: number): string[] | undefined => {
    const editor = getActiveEditor();
    if (!editor) return undefined;
    const currentLine = editor.selection.active.line;
    const endLine = Math.min(editor.document.lineCount, currentLine + n);
    const lines: string[] = [];
    for (let i = currentLine + 1; i < endLine; i++) {
        lines.push(editor.document.lineAt(i).text);
    }
    return lines;
};

/**
* Gets `m` lines before and `n` lines after the current line.
*/
export const getMAndNLinesBeforeAfter = (m: number, n: number): { before: string[]; after: string[] } | undefined => {
    const editor = getActiveEditor();
    // eslint-disable-next-line curly
    if (!editor) return undefined;
    return {
        before: getNLinesBefore(m) || [],
        after: getNLinesAfter(n) || []
    };
};

/**
 * Utility function to create a new untitled text editor on the side of the current active editor.
 * If no active editor exists, it opens a new one.
 */
export const createUntitledTextEditorOnSide = async (): Promise<vscode.TextEditor> => {
    const column = vscode.window.activeTextEditor?.viewColumn;
    const sideColumn = column !== undefined ? column + 1 : vscode.ViewColumn.One;

    const document = await vscode.workspace.openTextDocument({ language: 'plaintext', content: '' });
    return vscode.window.showTextDocument(document, sideColumn);
};

/**
 * Utility function to create and insert text into a new untitled text editor on the side.
 * @param content The text to insert into the new untitled editor.
 */
export const createAndInsertTextIntoUntitledEditor = async (content: string): Promise<void> => {
    const editor = await createUntitledTextEditorOnSide();
    const edit = new vscode.WorkspaceEdit();
    const range = new vscode.Range(0, 0, 0, 0); // Start at the beginning

    edit.insert(editor.document.uri, range.start, content);
    await vscode.workspace.applyEdit(edit);
};

// 1. Show Opened Editors Programmatically
// You can show the "Opened Editors" list in the Explorer pane by ensuring the explorer.openEditors.visible setting is greater than 0.
// This can be done with the workspace.getConfiguration API:
export function showOpenedEditors() {
    const config = vscode.workspace.getConfiguration('explorer');
    config.update('openEditors.visible', 5, vscode.ConfigurationTarget.Global);
}

export function closeAllEditors() {
    vscode.commands.executeCommand('workbench.action.closeAllEditors');
}

export function closeAllButActiveEditor() {
    vscode.commands.executeCommand('workbench.action.closeOtherEditors');
}

export function register_editors_commands(context: vscode.ExtensionContext) {
    register_toggle_right_group_commands(context);
    register_opened_editors_commands(context);
}