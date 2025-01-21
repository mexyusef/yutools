import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Global variable to store the current working directory
let currentWorkingDirectory: string | undefined;

export const createAndOpenFolder = vscode.commands.registerCommand('yutools.folders.createAndOpenFolder',
  async () => {
    // Get the working directory from VSCode configuration settings
    const config = vscode.workspace.getConfiguration('yutools');
    const workingDirectory = config.get<string>('currentBantuanWorkingDirectory');

    if (!workingDirectory) {
      vscode.window.showErrorMessage(
        'Working directory is not set. Please configure "yutools.currentBantuanWorkingDirectory" in settings.'
      );
      return;
    }

    // Ask the user for the folder path
    const folderPath = await vscode.window.showInputBox({
      prompt: 'Enter the folder path (absolute or relative):',
      placeHolder: 'e.g., C:\\myfolder or myfolder',
    });

    if (!folderPath) {
      vscode.window.showErrorMessage('No folder path provided.');
      return;
    }

    // Determine if the input is an absolute path
    const isAbsolute = path.isAbsolute(folderPath);

    // Resolve the full path
    const fullPath = isAbsolute
      ? folderPath
      : path.join(workingDirectory, folderPath);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      try {
        fs.mkdirSync(fullPath, { recursive: true });
        vscode.window.showInformationMessage(`Folder created: ${fullPath}`);
      } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to create folder: ${error.message}`);
        return;
      }
    } else {
      vscode.window.showInformationMessage(`Folder already exists: ${fullPath}`);
    }

    // Update the current working directory to the new folder
    currentWorkingDirectory = fullPath;

    // Optionally, update the configuration setting (if you want to persist it)
    await config.update('currentBantuanWorkingDirectory', fullPath, vscode.ConfigurationTarget.Global);

    // Open the folder in a new VSCode window
    vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(fullPath), {
      forceNewWindow: true,
    });
  }
);