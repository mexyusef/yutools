import * as vscode from 'vscode';
import { folderBookmarkKey } from './constants';
import { getBookmarks } from './getBookmarks';
import { loadCommands } from '@/libraries/commands/loadCommands';

export const openTerminalAndRunCommand = vscode.commands.registerCommand('yutools.bookmarks.redis.openTerminalAndRunCommand', async () => {

  try {
    // Step 1: Get the bookmarked folders
    const bookmarks = await getBookmarks(folderBookmarkKey);
    if (bookmarks.length === 0) {
      vscode.window.showInformationMessage('No folders in bookmark.');
      return;
    }

    // Step 2: Prompt the user to select a folder
    const selectedFolder = await vscode.window.showQuickPick(
      bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
      { placeHolder: 'Select a folder to open a terminal' }
    );

    if (!selectedFolder) {
      return; // Exit if no folder is selected
    }

    // Step 3: Create or get the terminal with the selected folder as the working directory
    const terminal = vscode.window.createTerminal({
      name: selectedFolder.uri.fsPath,
      cwd: selectedFolder.uri.fsPath,
    });

    // Step 4: Load the available commands
    const commands = await loadCommands();
    console.log('Commands:', JSON.stringify(commands)); // Debugging line
    // Step 5: Prompt the user to select a command
    // const selectedCommand = await vscode.window.showQuickPick(
    //   commands.map(c => ({ label: c.label, value: c.value })),
    //   { placeHolder: "Select a command to run in the terminal" }
    // );
    let selectedCommand;
    try {
      selectedCommand = await vscode.window.showQuickPick(
        commands.map(c => ({ label: c.label, value: c.value })),
        { placeHolder: "Select a command to run in the terminal" }
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error during command selection: ${error.message}`);
      return;
    }
    if (!selectedCommand) {
      vscode.window.showWarningMessage('No command selected.');
      return; // Exit if no command is selected
    }

    let commandToRun = selectedCommand.value;

    // Step 6: If the selected command is __INPUT__, prompt the user for custom input
    if (commandToRun === "__INPUT__") {
      const userInput = await vscode.window.showInputBox({
        prompt: 'Enter the custom command to run in the terminal',
        placeHolder: 'e.g., echo Hello World',
      });
      if (!userInput) {
        vscode.window.showWarningMessage('No command entered.');
        return; // Exit if no custom command is entered
      }
      commandToRun = userInput;
    }

    terminal.show();

    // Step 7: Send the command to the terminal
    terminal.sendText(commandToRun);
  } catch (error: any) {
    vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
  }
});
