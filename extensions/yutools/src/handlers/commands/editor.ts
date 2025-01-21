import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { extension_name } from '../../constants';
import { getInvokedDirectory } from '../file_dir';
import { getConfigValue } from '@/configs';
import { insertTextAtCursor_createActiveEditor } from '../editorutils';

const editor_selection_to_file = vscode.commands.registerCommand(`${extension_name}.editor_selection_to_file`,
    async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const selection = editor.document.getText(editor.selection);

        if (!selection) {
            vscode.window.showErrorMessage('No text selected.');
            return;
        }

        const filename = await vscode.window.showInputBox({
            prompt: 'Enter the filename to save the selection',
            placeHolder: 'example.txt',
        });

        if (!filename) {
            vscode.window.showErrorMessage('Filename is required.');
            return;
        }

        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder open.');
            return;
        }

        const folderPath = getConfigValue('currentWorkingDirectory', getInvokedDirectory() as string);
        // await run_fmus_at_specific_dir(processed_input, folderPath);
        // const folderPath = workspaceFolders[0].uri.fsPath;
        const filePath = path.join(folderPath, filename);
        try {
            fs.writeFileSync(filePath, selection, 'utf8');
            vscode.window.showInformationMessage(`Selection saved to ${filename}`);
            const document = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(document);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to save file: ${error.message}`);
        }
    }
);

const editor_copy_selection_file_to_cwd = vscode.commands.registerCommand(`${extension_name}.editor_copy_selection_file_to_cwd`,
    async () => {
        const editor = vscode.window.activeTextEditor;

        // Check if there's an active editor and it's associated with a file
        if (!editor || !editor.document.uri.fsPath) {
            return vscode.window.showErrorMessage("No file to copy (Untitled files cannot be copied).");
        }

        const sourcePath = editor.document.uri.fsPath;

        const targetDir = vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') as string
        // const targetDir = await vscode.window.showInputBox({
        //     prompt: "Enter the target directory",
        //     placeHolder: "e.g., C:\\MyFolder",
        // });

        if (!targetDir) {
            return; // User canceled the input
        }

        try {
            // Validate the target path
            if (!fs.existsSync(targetDir)) {
                return vscode.window.showErrorMessage("Target directory does not exist.");
            }

            const targetStat = fs.statSync(targetDir);
            if (!targetStat.isDirectory()) {
                return vscode.window.showErrorMessage("Target path is not a directory.");
            }

            // Prevent copying to the same directory
            if (path.dirname(sourcePath) === targetDir) {
                return vscode.window.showErrorMessage("Source and target directories are the same.");
            }

            // Perform the copy operation
            const fileName = path.basename(sourcePath);
            const targetPath = path.join(targetDir, fileName);

            fs.copyFileSync(sourcePath, targetPath);

            // Show success notification
            vscode.window.showInformationMessage(`File copied to ${targetDir}`);
        } catch (error) {
            console.error(error);
            vscode.window.showErrorMessage("An error occurred while copying the file.");
        }
    }
);

const editor_delete_active_file = vscode.commands.registerCommand(`${extension_name}.editor_delete_active_file`,
    async () => {
        const activeEditor = vscode.window.activeTextEditor;

        if (!activeEditor) {
            vscode.window.showWarningMessage('No active file to delete.');
            return;
        }

        const document = activeEditor.document;
        const filePath = document.uri.fsPath;

        // Confirm deletion
        const confirmation = await vscode.window.showWarningMessage(
            `Are you sure you want to delete ${path.basename(filePath)}?`,
            { modal: true },
            'Delete'
        );

        if (confirmation === 'Delete') {
            try {
                // Close the document
                await vscode.workspace.fs.delete(document.uri, { recursive: true, useTrash: true });

                vscode.window.showInformationMessage(`File ${path.basename(filePath)} deleted successfully.`);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Failed to delete file: ${error.message}`);
            }
        }
    }
);

const editor_fold_all = vscode.commands.registerCommand(`${extension_name}.editor_fold_all`,
    () => {
        vscode.commands.executeCommand('editor.foldAll');
    }
);

const editor_insert_text_at_cursor = vscode.commands.registerCommand(`${extension_name}.editor_insert_text_at_cursor`,
    async (text: string) => {
        insertTextAtCursor_createActiveEditor(text);
    }
);

const editor_rename_active_file = vscode.commands.registerCommand('yutools.editor_rename_active_file', async () => {
    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const document = activeEditor.document;

    if (document.isUntitled) {
        vscode.window.showErrorMessage('The file is untitled and cannot be renamed.');
        return;
    }

    const currentFilePath = document.fileName;
    const currentDir = path.dirname(currentFilePath);
    const currentFileName = path.basename(currentFilePath);

    const newFileName = await vscode.window.showInputBox({
        prompt: 'Enter the new filename',
        value: currentFileName,
        validateInput: (input) => {
            if (!input || input.trim() === '') {
                return 'Filename cannot be empty.';
            }
            if (input.includes(path.sep)) {
                return 'Filename cannot contain path separators.';
            }
            return null;
        }
    });

    if (!newFileName) {
        vscode.window.showInformationMessage('Rename operation canceled.');
        return;
    }

    const newFilePath = path.join(currentDir, newFileName);

    try {
        fs.renameSync(currentFilePath, newFilePath);

        // Open the renamed file in the editor
        const uri = vscode.Uri.file(newFilePath);
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document);

        vscode.window.showInformationMessage(`File renamed to ${newFileName}`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to rename file: ${error.message}`);
    }
});

export function register_editor_menu(context: vscode.ExtensionContext) {
    context.subscriptions.push(editor_selection_to_file);
    context.subscriptions.push(editor_fold_all);
    context.subscriptions.push(editor_copy_selection_file_to_cwd);
    context.subscriptions.push(editor_delete_active_file);
    context.subscriptions.push(editor_insert_text_at_cursor);
    context.subscriptions.push(editor_rename_active_file);
}
