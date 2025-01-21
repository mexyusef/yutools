import * as vscode from 'vscode';
import { compressFile } from './compressFile';

/**
 * Activates the extension.
 * 
 * @param context The extension context.
 */
export const compressFileCommand = vscode.commands.registerCommand('yutools.files.compress.compressFile',
  async (filePath: string = '.') => {
    let targetFilePath = filePath;

    // If filePath is ".", use the currently active editor's file path
    if (filePath === '.') {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        targetFilePath = activeEditor.document.uri.fsPath;
      } else {
        // If no active editor, prompt the user to select a file
        const fileUri = await vscode.window.showOpenDialog({
          canSelectFiles: true,
          canSelectFolders: false,
          canSelectMany: false,
          openLabel: 'Select a file to compress'
        });

        if (fileUri && fileUri[0]) {
          targetFilePath = fileUri[0].fsPath;
        } else {
          vscode.window.showErrorMessage('No file selected.');
          return;
        }
      }
    }

    // Compress the file
    compressFile(targetFilePath);
  });