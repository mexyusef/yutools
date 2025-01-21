import * as vscode from 'vscode';
import { exec } from 'child_process';

// Command 1: Execute shell command and show the result in the editor
export const executeShellCommand = vscode.commands.registerCommand('yutools.commands.executeShell', async () => {
  const command = await vscode.window.showInputBox({ prompt: 'Enter the shell command to execute' });
  if (command) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(`Error: ${stderr}`);
        return;
      }
      const output = stdout || stderr;
      const document = vscode.workspace.openTextDocument({ content: output });
      document.then(doc => vscode.window.showTextDocument(doc));
    });
  }
});

// Command 1: Execute shell command and show the result in the editor
export const executeShellDynamicCommand = vscode.commands.registerCommand('yutools.commands.executeShellDynamic',
  async (command: string) => {
    if (!command) {
      vscode.window.showErrorMessage('No command provided.');
      return;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(`Error: ${stderr}`);
        return;
      }
      const output = stdout || stderr;
      const document = vscode.workspace.openTextDocument({ content: output });
      document.then((doc) => vscode.window.showTextDocument(doc));
    });
  }
);

// open browser "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" and open gmail.com

// open browser C:\Users\usef\AppData\Local\Maxthon\Maxthon.exe and open google.com

// open browser C:\Users\usef\Desktop\midori\midori.exe and open and open youtube.com

// vscode.commands.executeCommand('yutools.commands.executeShellCommand', 'dir "C:\\Program Files (x86)\\Microsoft\\Edge\\Application"');

// vscode.commands.executeCommand(
//   'yutools.commands.openBrowserWithUrl',
//   'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
//   'https://gmail.com'
// );
// {
//   "key": "ctrl+alt+e",
//   "command": "yutools.commands.executeShellCommand",
//   "args": "dir C:\\"
// },
// {
//   "key": "ctrl+alt+b",
//   "command": "yutools.commands.openBrowserWithUrl",
//   "args": {
//     "browserPath": "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
//     "url": "https://gmail.com"
//   }
// }
