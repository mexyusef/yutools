import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// Global variable to store the current working directory
let currentWorkingDirectory: string | undefined;

export const createAndOpenFolderWithArgs = vscode.commands.registerCommand('yutools.folders.createAndOpenFolderWithArgs',
  async (args: { baseFolder?: string } = {}) => {
    // Get the working directory from VSCode configuration settings
    const config = vscode.workspace.getConfiguration('yutools');
    let workingDirectory = config.get<string>('currentBantuanWorkingDirectory', 'C:\\hapus');

    if (!args.baseFolder) {
      workingDirectory = args.baseFolder || workingDirectory;
    }

    // let folderPath = args.folderPath;

    // // If folderPath is not provided in args, prompt the user for input
    // if (!folderPath) {
    //   folderPath = await vscode.window.showInputBox({
    //     prompt: 'Enter the folder path (absolute or relative):',
    //     placeHolder: 'e.g., C:\\myfolder or myfolder',
    //   });

    //   if (!folderPath) {
    //     vscode.window.showErrorMessage('No folder path provided.');
    //     return;
    //   }
    // }
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