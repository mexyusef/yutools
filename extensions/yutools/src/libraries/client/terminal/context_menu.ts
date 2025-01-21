import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { getTerminalCwd } from '@/handlers/terminal_common';

// https://code.visualstudio.com/api/references/contribution-points#contributes.menus
// terminal/context - terminal context menu
// terminal/title/context - terminal title context menu
// https://stackoverflow.com/questions/46914386/is-there-a-setting-to-enable-the-context-menu-for-the-integrated-console-in-vs-c

const runGitCommand = (command: string) => {
  const terminal = vscode.window.activeTerminal || vscode.window.createTerminal("Git Terminal");
  terminal.show();
  terminal.sendText(command);
};

// Run 'git add' with the specified files or directory
async function runGitAdd(cwd: string, filePaths: string) {
  try {
    child_process.execSync(`git add ${filePaths}`, { cwd });
  } catch (error) {
    throw new Error('Git add failed.');
  }
}

// Fetch files using 'git status' in the given directory
async function fetchGitStatus(cwd: string): Promise<{ label: string, description: string }[]> {
  try {
    const statusOutput = child_process
      .execSync('git status --short', { cwd })
      .toString();

    return statusOutput.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const filePath = line.slice(3); // Remove the `??` or ` M` prefix
        return { label: filePath, description: line.trim() };
      });
  } catch (error) {
    throw new Error('Git status failed.');
  }
}

export const gitAddCommand = vscode.commands.registerCommand('yutools.terminal.gitAdd', async () => {
  const terminal = vscode.window.activeTerminal;
  if (!terminal) {
    vscode.window.showErrorMessage('No active terminal found.');
    return;
  }
  // Use the workspace's root path if no terminal-specific solution is available
  // const cwd = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
  // if (!cwd) {
  //   vscode.window.showErrorMessage('Unable to determine workspace directory.');
  //   return;
  // }
  const cwd = getTerminalCwd(terminal);
  try {
    terminal.sendText('git add .');
    // const files = await fetchGitStatus(cwd);
    // files.unshift({ label: "Add All Files", description: "Stage all changes (git add .)" });

    // const selectedFiles = await vscode.window.showQuickPick(files, {
    //   canPickMany: true,
    //   placeHolder: `Select files to stage in ${cwd}`,
    // });

    // if (!selectedFiles || selectedFiles.length === 0) {
    //   vscode.window.showWarningMessage(`No files selected for staging in ${cwd} from ${JSON.stringify(files)}`);
    //   return;
    // }

    // const addAll = selectedFiles.some(file => file.label === "Add All Files");
    // if (addAll) {
    //   await runGitAdd(cwd, '.');
    //   vscode.window.showInformationMessage('All files staged successfully.');
    // } else {
    //   const filePaths = selectedFiles.map(file => file.label).join(' ');
    //   await runGitAdd(cwd, filePaths);
    //   vscode.window.showInformationMessage(`Staged files: ${selectedFiles.map(file => file.label).join(', ')}`);
    // }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to fetch git status or stage files in ${cwd}.`);
  }
});

const gitCommitCommand = vscode.commands.registerCommand('yutools.terminal.gitCommit', async () => {
  const commitMessage = await vscode.window.showInputBox({
    prompt: "Enter your commit message",
    placeHolder: "Type your commit message here...",
    validateInput: (input) => (input.trim() === '' ? 'Commit message cannot be empty' : undefined)
  });

  if (commitMessage !== undefined) {
    const gitCommit = `git commit -am "${commitMessage.replace(/"/g, '\\"')}"`;
    runGitCommand(gitCommit);
    vscode.window.showInformationMessage(`Commit executed with message: "${commitMessage}"`);
  } else {
    vscode.window.showWarningMessage('Commit canceled');
  }
});

export function register_terminal_context_menu(context: vscode.ExtensionContext) {
  // Paste Clipboard Command
  const pasteClipboard = vscode.commands.registerCommand('yutools.terminal.pasteClipboard', () => {
    vscode.commands.executeCommand('workbench.action.terminal.paste');
  });

  // // Run Custom Command
  // const runCommand = vscode.commands.registerCommand('yutools.terminal.runCommand', () => {
  //   vscode.window.showInformationMessage('Custom command executed!');
  // });

  // Git Log Command
  const gitLogCommand = vscode.commands.registerCommand('yutools.terminal.gitLog', () => {
    const gitLog = `git log --pretty=format:"%C(yellow)%h%C(reset) %C(blue)%an%C(reset) %C(red)%ad%C(reset) %C(cyan)%s%C(reset)%n%b%C(green)%+d%C(reset)%n" --name-only --date=short`;
    runGitCommand(gitLog);
  });

  // Git Diff Command
  const gitDiffCommand = vscode.commands.registerCommand('yutools.terminal.gitDiff', () => {
    const gitDiff = `git diff --color`;
    runGitCommand(gitDiff);
  });

  const gitAddAllCommand = vscode.commands.registerCommand('yutools.terminal.gitAddAll', () => {
    const gitDiff = `git add .`;
    runGitCommand(gitDiff);
  });
  // Git Status Command
  const gitStatusCommand = vscode.commands.registerCommand('yutools.terminal.gitStatus', () => {
    const gitStatus = `git status --branch --show-stash`;
    runGitCommand(gitStatus);
  });

  // Show Message Command
  const showMessage = vscode.commands.registerCommand('yutools.terminal.showMessage', () => {
    vscode.window.showInformationMessage('Ini contoh vscode command dengan pesan lewat yutools.terminal.showMessage!');
  });

  context.subscriptions.push(pasteClipboard, showMessage);
  context.subscriptions.push(gitLogCommand, gitDiffCommand, gitStatusCommand, gitCommitCommand);
  context.subscriptions.push(gitAddCommand, gitAddAllCommand);
}
