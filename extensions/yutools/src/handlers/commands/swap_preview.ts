import * as vscode from 'vscode';
import { main_file_templates } from '@/constants';
import { openWindowsCmdTerminal, overrideFileWithBackup, runTerminalCommand } from '../editorutils';
import { openAddressInBrowser } from '../networkutils';
import { getPromptAndContext } from './vendor';
import { createWebview } from './webviews';
// import { getPromptAndContext, overrideFileWithBackup } from '../vsutils/vendor';
// import { createWebview } from '../components/previews/common';

// swap file content and preview on webview or browser

export async function run_project_on_terminal(framework: string) {
  const terminal = openWindowsCmdTerminal();
  // const port = main_file_templates[framework]["port"];
  let perintah = main_file_templates[framework]["command"];
  // perintah = perintah.replace('__ROOTDIR__', main_file_templates[framework]["root"]).replace('__PORT__');
  // perintah = perintah.replace('__ROOTDIR__', main_file_templates[framework]["root"]).replace('__PORT__', String(main_file_templates[framework]["port"]));
  perintah = perintah.replace(/__ROOTDIR__/g, main_file_templates[framework]["root"]).replace(/__PORT__/g, String(main_file_templates[framework]["port"]));
  await runTerminalCommand(terminal, perintah);
}

export function preview_project(framework: string) {
  const alamat = main_file_templates[framework]["url"].replace('__PORT__', String(main_file_templates[framework]["port"]));
  // preview on webview or browser
  // displayServicesInWebView();
  createWebview(alamat, framework);
}

export function preview_project_browser(framework: string) {
  const alamat = main_file_templates[framework]["url"].replace('__PORT__', String(main_file_templates[framework]["port"]));
  openAddressInBrowser(alamat);
}

export async function terminal_and_preview_project(framework: string, open_in_browser: boolean = false) {
  await run_project_on_terminal(framework);

  const alamat = main_file_templates[framework]["url"].replace('__PORT__', String(main_file_templates[framework]["port"]));

  if (open_in_browser) {
    openAddressInBrowser(alamat);
  } else {
    createWebview(alamat, framework);
  }
}

// Main utility function that ties everything together
export async function swap_and_preview(framework: string, open_in_browser: boolean = false) {
  try {
    // const selection = getEditorSelection();
    const { prompt: selection, context } = await getPromptAndContext();

    const filePath = main_file_templates[framework]["file"]; //getBackupFilePath();

    // const backupFilePath = await createFileBackup(filePath);
    // await swapFileContent(filePath, selection as string);
    const status = overrideFileWithBackup(filePath, selection as string);

    // // run command on terminal
    // const terminal = openWindowsCmdTerminal();
    // // const port = main_file_templates[framework]["port"];
    // let perintah = main_file_templates[framework]["command"];
    // // perintah = perintah.replace('__ROOTDIR__', main_file_templates[framework]["root"]).replace('__PORT__');
    // perintah = perintah.replace('__ROOTDIR__', main_file_templates[framework]["root"]).replace('__PORT__', String(main_file_templates[framework]["port"]));
    // await runTerminalCommand(terminal, perintah);
    await run_project_on_terminal(framework);

    // const alamat = main_file_templates[framework]["url"].replace('__PORT__', String(main_file_templates[framework]["port"]));
    // // preview on webview or browser
    // // displayServicesInWebView();
    // createWebview(alamat, framework);

    if (open_in_browser) {
      preview_project_browser(framework);
    } else {
      preview_project(framework);
    }

  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}

// 1. Get the selection from the active editor
function getEditorSelection() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    throw new Error('No active editor found');
  }
  return editor.document.getText(editor.selection);
}

// 2. Retrieve file path to be backed up from configuration
function getBackupFilePath(): string {
  const filePath = vscode.workspace.getConfiguration('myExtension').get('backupFilePath') as string;
  if (!filePath) {
    throw new Error('Backup file path is not configured');
  }
  return filePath;
}

// 3. Create a backup of the specified file (returns the backup file path)
async function createFileBackup(filePath: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilePath = `${filePath}.${timestamp}.bak`;
  await copyFile(filePath, backupFilePath); // Handle async file copying
  return backupFilePath;
}

// Helper function for copying a file
async function copyFile(src: string, dest: string) {
  // Use fs/promises or similar API for async file operations
  const fs = require('fs').promises;
  await fs.copyFile(src, dest);
}

// 4. Swap file content with editor selection
async function swapFileContent(filePath: string, newContent: string) {
  await writeFile(filePath, newContent); // Async file writing
}

// Helper function for writing to a file
async function writeFile(filePath: string, content: string) {
  const fs = require('fs').promises;
  await fs.writeFile(filePath, content);
}

// // 5. Open a new terminal (cmd.exe) in VSCode
// function openTerminal() {
//   const terminal = vscode.window.createTerminal({ name: 'My Terminal', shellPath: 'cmd.exe' });
//   terminal.show();
//   return terminal;
// }

// // 6. Run the command configured in the settings
// async function runTerminalCommand(terminal: vscode.Terminal, command: string) {
//   // const command = vscode.workspace.getConfiguration('myExtension').get('commandToRun') as string;
//   // if (!command) {
//   //   throw new Error('Command to run is not configured');
//   // }
//   terminal.sendText(command);
// }

// 7. Display services in a webview (as a placeholder for now)
function displayServicesInWebView() {
  showServicesWebView(); // This function handles webview rendering logic
}

// Function to render services in a webview (this will be further expanded)
function showServicesWebView() {
  // Placeholder for webview implementation to show services
  console.log("Displaying services in webview...");
}
