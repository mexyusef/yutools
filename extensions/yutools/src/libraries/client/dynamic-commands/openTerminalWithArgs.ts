import * as vscode from 'vscode';

/*
 * vscode.commands.executeCommand('extension.openTerminalWithArgs', {
    terminalName: 'My Custom Terminal',
    cwd: '/path/to/workspace',
    commands: [
      'echo Hello, World!',
      'npm install',
      'npm start'
    ]
  });

  const args = {
    terminalName: 'My Custom Terminal',
    cwd: 'c:\\hapus',
    commands: [
      'echo Hello, World!',
      'pwd',
      'dir',
    ]
  };

  const markdownString = new vscode.MarkdownString(
    `[Execute Commands](command:extension.openTerminalWithArgs?${encodeURIComponent(JSON.stringify(args))})`
  );
  markdownString.isTrusted = true; // Enable command execution

  vscode.window.showInformationMessage('Click the link to execute commands in the terminal', markdownString);
 */
// C:\Users\usef\terminal-commands.md
export const openTerminalWithArgs = vscode.commands.registerCommand('yutools.dynamic-commands.openTerminalWithArgs', (args) => {
  // Destructure the arguments
  const { terminalName, cwd, commands } = args;

  // Validate the arguments
  if (!terminalName || !cwd || !Array.isArray(commands)) {
    vscode.window.showErrorMessage('Invalid arguments provided. Expected: terminalName, cwd, commands.');
    return;
  }

  // Create the terminal with the specified name and working directory
  const terminal = vscode.window.createTerminal({
    name: terminalName,
    cwd: cwd
  });

  // Show the terminal
  terminal.show();

  // Execute each command in the terminal
  commands.forEach((command) => {
    if (typeof command === 'string') {
      terminal.sendText(command);
    } else {
      vscode.window.showErrorMessage(`Invalid command: ${command}. Expected a string.`);
    }
  });
});