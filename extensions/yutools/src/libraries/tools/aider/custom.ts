import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const runAider = vscode.commands.registerCommand('yutools.llm.tools.aider.runAider', async () => {
  // Get the active file path or open folder dialog
  let cwd: string | undefined;
  const activeFile = vscode.window.activeTextEditor?.document.uri.fsPath;

  if (activeFile && !vscode.window.activeTextEditor?.document.isUntitled) {
    cwd = path.dirname(activeFile);
  } else {
    const folderUri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: 'Select Folder'
    });
    if (folderUri && folderUri.length > 0) {
      cwd = folderUri[0].fsPath;
    }
  }

  if (!cwd) {
    vscode.window.showErrorMessage('No directory selected.');
    return;
  }

  // Ensure a terminal is active or create one
  let terminal = vscode.window.activeTerminal;
  if (!terminal) {
    terminal = vscode.window.createTerminal({ cwd });
  } else {
    terminal.sendText(`cd "${cwd}"`);
  }

  // Read model names from aider.models.txt
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (!homeDir) {
    vscode.window.showErrorMessage('Could not determine user home directory.');
    return;
  }

  const modelsFilePath = path.join(homeDir, 'aider.models.txt');
  if (!fs.existsSync(modelsFilePath)) {
    vscode.window.showErrorMessage(`File not found: ${modelsFilePath}`);
    return;
  }

  const models = fs.readFileSync(modelsFilePath, 'utf8').split('\n').filter(line => line.trim());
  if (models.length === 0) {
    vscode.window.showErrorMessage('No models found in aider.models.txt.');
    return;
  }

  // Show quick pick to select a model
  const selectedModel = await vscode.window.showQuickPick(models, {
    placeHolder: 'Select a model'
  });

  if (!selectedModel) {
    vscode.window.showErrorMessage('No model selected.');
    return;
  }

  // Send commands to the terminal
  terminal.sendText(`set PYTHONPATH=C:\\ai\\yuagent\\extensions\\yu-servers\\aider`);
  terminal.sendText(`python -m aider --model ${selectedModel}`);
  terminal.show();
});

const sendCommandToTerminal = vscode.commands.registerCommand('yutools.llm.tools.aider.sendCommandToTerminal', async () => {
  // Check if there's an active terminal
  const terminal = vscode.window.activeTerminal;
  if (!terminal) {
    vscode.window.showErrorMessage('No active terminal found.');
    return;
  }

  // Read commands from aider.commands.txt
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (!homeDir) {
    vscode.window.showErrorMessage('Could not determine user home directory.');
    return;
  }

  const commandsFilePath = path.join(homeDir, 'aider.commands.txt');
  if (!fs.existsSync(commandsFilePath)) {
    vscode.window.showErrorMessage(`File not found: ${commandsFilePath}`);
    return;
  }

  const commands = fs.readFileSync(commandsFilePath, 'utf8').split('\n').filter(line => line.trim());
  if (commands.length === 0) {
    vscode.window.showErrorMessage('No commands found in aider.commands.txt.');
    return;
  }

  // Show quick pick to select a command
  const selectedCommand = await vscode.window.showQuickPick(commands, {
    placeHolder: 'Select a command to send to the terminal'
  });

  if (!selectedCommand) {
    vscode.window.showErrorMessage('No command selected.');
    return;
  }

  // Handle __NO_ENTER__ suffix
  let commandToSend = selectedCommand;
  let pressEnter = true;

  if (commandToSend.endsWith('__NO_ENTER__')) {
    commandToSend = commandToSend.replace('__NO_ENTER__', '').trim();
    pressEnter = false;
  }

  // Send the command to the terminal
  if (pressEnter) {
    terminal.sendText(commandToSend);
  } else {
    // Send text without pressing Enter
    (terminal as any).sendText(commandToSend, false);
  }

  terminal.show();
});

const runAiderWithApiBase = vscode.commands.registerCommand('yutools.llm.tools.aider.runAiderWithApiBase', async () => {
  // Get the active file path or open folder dialog
  let cwd: string | undefined;
  const activeFile = vscode.window.activeTextEditor?.document.uri.fsPath;

  if (activeFile && !vscode.window.activeTextEditor?.document.isUntitled) {
    cwd = path.dirname(activeFile);
  } else {
    const folderUri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: 'Select Folder'
    });
    if (folderUri && folderUri.length > 0) {
      cwd = folderUri[0].fsPath;
    }
  }

  if (!cwd) {
    vscode.window.showErrorMessage('No directory selected.');
    return;
  }

  // Ensure a terminal is active or create one
  let terminal = vscode.window.activeTerminal;
  if (!terminal) {
    terminal = vscode.window.createTerminal({ cwd });
  } else {
    terminal.sendText(`cd "${cwd}"`);
  }

  // Read model names from aider.models.txt
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (!homeDir) {
    vscode.window.showErrorMessage('Could not determine user home directory.');
    return;
  }

  const modelsFilePath = path.join(homeDir, 'aider.models.txt');
  if (!fs.existsSync(modelsFilePath)) {
    vscode.window.showErrorMessage(`File not found: ${modelsFilePath}`);
    return;
  }

  const models = fs.readFileSync(modelsFilePath, 'utf8').split('\n').filter(line => line.trim());
  if (models.length === 0) {
    vscode.window.showErrorMessage('No models found in aider.models.txt.');
    return;
  }

  // Read API bases from aider.apibases.txt
  const apiBasesFilePath = path.join(homeDir, 'aider.apibases.txt');
  if (!fs.existsSync(apiBasesFilePath)) {
    vscode.window.showErrorMessage(`File not found: ${apiBasesFilePath}`);
    return;
  }

  const apiBases = fs.readFileSync(apiBasesFilePath, 'utf8').split('\n').filter(line => line.trim());
  if (apiBases.length === 0) {
    vscode.window.showErrorMessage('No API bases found in aider.apibases.txt.');
    return;
  }

  // Show quick pick to select a model
  const selectedModel = await vscode.window.showQuickPick(models, {
    placeHolder: 'Select a model'
  });

  if (!selectedModel) {
    vscode.window.showErrorMessage('No model selected.');
    return;
  }

  // Show quick pick to select an API base
  const selectedApiBase = await vscode.window.showQuickPick(apiBases, {
    placeHolder: 'Select an API base'
  });

  if (!selectedApiBase) {
    vscode.window.showErrorMessage('No API base selected.');
    return;
  }

  // Send commands to the terminal
  terminal.sendText(`set PYTHONPATH=C:\\ai\\yuagent\\extensions\\yu-servers\\aider`);
  terminal.sendText(`python -m aider --model ${selectedModel} --openai-api-base ${selectedApiBase}`);
  terminal.show();
});

export function register_tools_aider_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    runAider,
    runAiderWithApiBase,
    sendCommandToTerminal
  );
}
