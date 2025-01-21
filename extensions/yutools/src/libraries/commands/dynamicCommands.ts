import * as vscode from 'vscode';
import { loadCommands } from './loadCommands';
// import * as path from 'path';
// import * as fs from 'fs';
// import * as os from 'os';
// c:\users\usef\commands.json
// const jsonFileName = 'commands.json';
// const jsonFilePath = path.join(os.homedir(), jsonFileName);

async function selectAndRunCommand() {
  const commands = await loadCommands();

  // Show the user a Quick Pick menu to select a command
  const selected = await vscode.window.showQuickPick(
    commands.map(c => ({ label: c.label, value: c.value })),
    { placeHolder: "Select a command to run in the terminal" }
  );

  if (!selected) {
    vscode.window.showWarningMessage('No command selected.');
    return;
  }

  let commandToRun = selected.value;

  // If the selected command is __INPUT__, prompt the user for custom input
  if (commandToRun === "__INPUT__") {
    const userInput = await vscode.window.showInputBox({
      prompt: 'Enter the custom command to run in the terminal',
      placeHolder: 'e.g., echo Hello World',
    });
    if (!userInput) {
      vscode.window.showWarningMessage('No command entered.');
      return;
    }
    commandToRun = userInput;
  }

  // Get the active terminal or create a new one
  let terminal = vscode.window.activeTerminal;
  if (!terminal) {
    terminal = vscode.window.createTerminal('Dynamic Command');
  }

  // Show the terminal and send the command
  terminal.show();
  terminal.sendText(commandToRun);
}

export function register_client_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.cmd.runDynamicCommand', selectAndRunCommand)
  );
}
