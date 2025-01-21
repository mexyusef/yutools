import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { extension_name } from '../constants';
import { hidden_prompt_prefix, hidden_prompt_suffix } from '../constants';
import { preprocessStringPermissive } from './stringutils';

const outputChannel = vscode.window.createOutputChannel(extension_name);

export function pesan(message: string) {
  outputChannel.appendLine(message);
  outputChannel.show(); // Optional: Automatically show the output channel
}

export function openURLInBrowser(url: string) {
  vscode.env.openExternal(vscode.Uri.parse(url));
}

export async function createNewFolder(folderName: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (workspaceFolder) {
    const newFolderPath = path.join(workspaceFolder, folderName);
    if (!fs.existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath);
      vscode.window.showInformationMessage(`Folder created: ${newFolderPath}`);
    } else {
      vscode.window.showWarningMessage('Folder already exists');
    }
  } else {
    vscode.window.showInformationMessage('No workspace folder is open');
  }
}

export function showTerminal() {
  vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal');
}

export function openPowershellTerminal() {
  vscode.window.createTerminal({ name: "PowerShell", shellPath: 'powershell.exe' }).show();
}

export function openWindowsCmdTerminal(perintah: string | undefined = undefined) {
  // vscode.window.createTerminal({ name: "CMD", shellPath: 'cmd.exe' }).show();
  const terminal = vscode.window.createTerminal({ name: "CMD", shellPath: 'cmd.exe' });
  terminal.show();
  if (perintah !== undefined) {
    terminal.sendText("dir");
  }
  return terminal;
}

// 6. Run the command configured in the settings
export function runTerminalCommand(terminal: vscode.Terminal, command: string) {
  terminal.sendText(command);
}

export function runCustomCommandInTerminal(command: string) {
  const terminal = vscode.window.createTerminal();
  terminal.show();
  terminal.sendText(command);
}

export async function sendCommandToActiveTerminalProcessInput(command: string) {
  const activeTerminal = vscode.window.activeTerminal;
  if (activeTerminal) {
    const processedCommand = await preprocessStringPermissive(command);
    if (processedCommand) {
      activeTerminal.show();  // Bring the terminal to focus if it's hidden
      activeTerminal.sendText(processedCommand);
    }
  } else {
    vscode.window.showInformationMessage('No active terminal');
  }
}

export function sendCommandToActiveTerminal(command: string) {
  const activeTerminal = vscode.window.activeTerminal;

  if (activeTerminal) {
    activeTerminal.show();  // Bring the terminal to focus if it's hidden
    activeTerminal.sendText(command);
  } else {
    vscode.window.showInformationMessage('No active terminal');
  }
}

export function sendCommandsToActiveTerminal(commands: string[]) {
  const activeTerminal = vscode.window.activeTerminal;

  if (activeTerminal) {
    activeTerminal.show();  // Bring the terminal to focus if it's hidden
    commands.forEach((command) => {
      activeTerminal.sendText(command);
    });
  } else {
    vscode.window.showInformationMessage('No active terminal');
  }
}

// const commands = [
//     'echo "Hello, World!"',
//     'cd path/to/your/directory',
//     'npm install',
//     // Add more commands as needed
// ];

// ini create dulu baru send commands, makanya gak pake istilah active terminal
export function sendCommandsToTerminal(commands: string[]) {
  // Get or create a terminal instance
  let terminal = vscode.window.activeTerminal;
  // If no terminal is open, create a new one
  if (!terminal) {
    terminal = vscode.window.createTerminal({ name: "CMD", shellPath: 'cmd.exe' });
  }
  // Show the terminal
  terminal.show();
  // Send each command to the terminal
  for (const command of commands) {
    terminal.sendText(command);
  }
}

export function doesFileExistInWorkspace(fileName: string): boolean {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (workspaceFolder) {
    const filePath = path.join(workspaceFolder, fileName);
    return fs.existsSync(filePath);
  }
  return false;
}

export function reloadWindow() {
  vscode.commands.executeCommand('workbench.action.reloadWindow');
}
// This function closes all open text editors.
export async function closeAllEditors() {
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');
}

export async function listAllWorkspaceFiles(): Promise<vscode.Uri[]> {
  if (vscode.workspace.workspaceFolders) {
    return await vscode.workspace.findFiles('**/*');
  }
  return [];
}

export function isActiveEditor(): boolean {
  return !!vscode.window.activeTextEditor;
}

// This function returns a list of all open text editors in the workspace.
export function getOpenEditorsList(): string[] {
  const editors = vscode.window.visibleTextEditors;
  return editors.map(editor => editor.document.fileName);
}

export function getWorkspaceFolder(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  return folders ? folders[0].uri.fsPath : undefined;
}

// utk ambil root, project/path/to/myfile kembalikan `project`
export function getRootFolderOfActiveFile(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
    return workspaceFolder ? workspaceFolder.uri.fsPath : undefined;
  } else {
    vscode.window.showInformationMessage('No active editor');
    return undefined;
  }
}

// utk ambil parent dir, project/path/to/myfile kembalikan `to`
export function getActiveEditorDirectory(): string | undefined {
  const filePath = getActiveEditorFilePath();
  return filePath ? path.dirname(filePath) : undefined;
}

export function getActiveEditorFilePath(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  return editor?.document.uri.fsPath;
}

export async function openFileInEditorWorkspace(fileName: string) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (workspaceFolder) {
    const filePath = path.join(workspaceFolder, fileName);
    const fileUri = vscode.Uri.file(filePath);
    const document = await vscode.workspace.openTextDocument(fileUri);
    vscode.window.showTextDocument(document);
  } else {
    vscode.window.showInformationMessage('No workspace folder is open');
  }
}

export async function openFileInEditor_errorIfDoesntExist(filePath: string) {
  try {
    const fileUri = vscode.Uri.file(path.resolve(filePath));
    const document = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(document);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to open file: ${error.message}`);
  }
}

export async function openFileInEditor(filePath: string) {
  try {
    const fileUri = vscode.Uri.file(path.resolve(filePath));
    // Check if the file exists
    try {
      await fs.promises.access(fileUri.fsPath);
    } catch (err) {
      // File does not exist, create the file
      await fs.promises.writeFile(fileUri.fsPath, ''); // Create an empty file
    }
    // Open the file in the editor
    const document = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(document);

  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to open or create file: ${error.message}`);
  }
}

export function insertTextAtCursor(text: string) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.edit(editBuilder => {
      const position = editor.selection.active;
      editBuilder.insert(position, text);
    });
  } else {
    vscode.window.showInformationMessage('No active editor');
  }
}

// Updated function that optionally creates an untitled editor if none are active
export async function insertTextAtCursor_createActiveEditor(text: string, createUntitledIfNone: boolean = true) {
  let editor = vscode.window.activeTextEditor;

  // Check if there's no active editor and create a new untitled editor if the option is enabled
  if (!editor && createUntitledIfNone) {
    editor = await createNewUntitledFile();
  }

  if (editor) {
    editor.edit(editBuilder => {
      const position = editor.selection.active;
      editBuilder.insert(position, text);
    });
  } else {
    vscode.window.showInformationMessage('No active editor and no untitled file created.');
  }
}

// Function to insert text from clipboard at the cursor position
export async function insertTextFromClipboardAtCursor() {
  let editor = vscode.window.activeTextEditor;

  // If no active editor, create a new untitled file
  if (!editor) {
    editor = await createNewUntitledFile();
  }

  if (editor) {
    const clipboardText = await vscode.env.clipboard.readText();
    if (clipboardText) {
      editor.edit(editBuilder => {
        const position = editor.selection.active;
        editBuilder.insert(position, clipboardText);
      });
    } else {
      vscode.window.showInformationMessage('Clipboard is empty');
    }
  }
}

export async function createNewFile(fileName: string) {
  const uri = vscode.Uri.file(`${vscode.workspace.workspaceFolders?.[0].uri.fsPath}/${fileName}`);
  const document = await vscode.workspace.openTextDocument(uri);
  vscode.window.showTextDocument(document);
}

// export async function createNewUntitledFile() {
// 	const newDocument = await vscode.workspace.openTextDocument({ content: '', language: 'plaintext' });
// 	await vscode.window.showTextDocument(newDocument);
// }

export async function createNewUntitledFile() {
  const newDocument = await vscode.workspace.openTextDocument({ content: '', language: 'plaintext' });
  await vscode.window.showTextDocument(newDocument);
  return vscode.window.activeTextEditor; // Return the newly opened editor
}

export function revealFileInExplorer() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    vscode.commands.executeCommand('revealFileInOS', editor.document.uri);
  } else {
    vscode.window.showInformationMessage('No active editor');
  }
}

export function copyActiveFilePathToClipboard() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const filePath = editor.document.uri.fsPath;
    vscode.env.clipboard.writeText(filePath);
    vscode.window.showInformationMessage(`Copied: ${filePath}`);
  } else {
    vscode.window.showInformationMessage('No active editor');
  }
}

export function countWordsInActiveEditor() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const documentText = editor.document.getText();
    const wordCount = documentText.split(/\s+/).filter(word => word.length > 0).length;
    vscode.window.showInformationMessage(`Word Count: ${wordCount}`);
  } else {
    vscode.window.showInformationMessage('No active editor');
  }
}

// export function getCorrectRootFolder(): string | undefined {
// 	const workspaceFolders = vscode.workspace.workspaceFolders;

// 	if (workspaceFolders && workspaceFolders.length > 0) {
// 		// If there's a single workspace folder open (e.g., a folder like c:\ai\fulled)
// 		return workspaceFolders[0].uri.fsPath;
// 	} else {
// 		vscode.window.showInformationMessage('No workspace folder is open');
// 		return undefined;
// 	}
// }
export function getCorrectRootFolder(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspaceFolder = workspaceFolders[0].uri.fsPath;
    return workspaceFolder;  // Just return the folder that was opened, no hardcoding
  } else {
    vscode.window.showInformationMessage('No workspace folder is open');
    return undefined;
  }
}

// Function to gather all information and insert it at the cursor
export async function gatherAndInsertInfoAtCursor() {
  let editor = vscode.window.activeTextEditor;

  // Create a new untitled file if no active editor
  if (!editor) {
    editor = await createNewUntitledFile();
  }

  if (editor) {

    const correctRootFolder = getCorrectRootFolder();
    // const workspaceFolder = 'workspace bikin gagal #1'; //getWorkspaceFolder();
    const workspaceFolder = getWorkspaceFolder();
    const rootFolder = getRootFolderOfActiveFile();
    const activeEditorDir = getActiveEditorDirectory();
    const activeEditorFilePath = getActiveEditorFilePath();
    const openEditors = getOpenEditorsList();

    // const allWorkspaceFiles = 'workspace bikin gagal #2'; //await listAllWorkspaceFiles();
    // Gathering information as text
    const info = `
		correctRootFolder: ${correctRootFolder || 'None'}
        Workspace Folder: ${workspaceFolder || 'None'}
        Root Folder of Active File: ${rootFolder || 'None'}
        Active Editor Directory: ${activeEditorDir || 'None'}
        Active Editor File Path: ${activeEditorFilePath || 'None'}
        Open Editors: ${openEditors.length > 0 ? openEditors.join(', ') : 'None'}

        `;
    // All Workspace Files: ${allWorkspaceFiles.length > 0 ? allWorkspaceFiles.map(f => f.fsPath).join(', ') : 'None'}

    // Insert information at the current cursor position
    await editor.edit(editBuilder => {
      const position = editor.selection.active;
      editBuilder.insert(position, info);
    });
  }
}

export async function openDirectory(): Promise<string | undefined> {
  // Open a file picker dialog to select a folder
  const selectedFolder = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Select Folder'
  });

  // Return the selected folder path if one was selected
  if (selectedFolder && selectedFolder.length > 0) {
    return selectedFolder[0].fsPath;
  } else {
    vscode.window.showInformationMessage('No folder selected');
    return undefined;
  }
}

// Update the Workspace Folders: VSCode provides the updateWorkspaceFolders API to modify the current workspace folders.
// Reload the Window: You can use the workbench.action.reloadWindow command to reload the VSCode window after changing the workspace folder.
export async function changeWorkspaceFolder(newFolder: string) {
  const uri = vscode.Uri.file(newFolder);

  // Update workspace folder to the new folder
  vscode.workspace.updateWorkspaceFolders(0, vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0, { uri });

  // Reload the window to apply the workspace folder change
  vscode.commands.executeCommand('workbench.action.reloadWindow');
}
// changeWorkspaceFolder('c:\\work\\myproject');

// Function to open a folder in the workspace (including reload)
export async function changeWorkspaceFolder_correctWay(newFolder: string) {
  const uri = vscode.Uri.file(newFolder);

  // Use the vscode.openFolder command to properly reload the workspace
  const success = await vscode.commands.executeCommand('vscode.openFolder', uri, false);

  if (!success) {
    vscode.window.showErrorMessage('Failed to open the folder in the workspace');
  }
}


export async function openDirectoryAndChangeWorkspace_old() {
  // Open a file picker dialog to select a folder
  const selectedFolder = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Select Folder'
  });

  // If a folder is selected, change the workspace folder
  if (selectedFolder && selectedFolder.length > 0) {
    const folderUri = selectedFolder[0].fsPath;
    changeWorkspaceFolder(folderUri);
  } else {
    vscode.window.showInformationMessage('No folder selected');
  }
}

export async function openDirectoryAndChangeWorkspace() {
  const folder = await openDirectory();
  if (folder) {
    // await changeWorkspaceFolder(folder);
    await changeWorkspaceFolder_correctWay(folder);
  }
}

export function clearActiveEditor() {
  // Get the active editor
  const editor = vscode.window.activeTextEditor;

  // Check if there's an active editor
  if (editor) {
    const document = editor.document;

    // Start an edit transaction
    editor.edit(editBuilder => {
      // Clear the entire document by replacing its range with an empty string
      const firstLine = document.lineAt(0);
      const lastLine = document.lineAt(document.lineCount - 1);
      const range = new vscode.Range(firstLine.range.start, lastLine.range.end);

      // Replace the document's content with an empty string
      editBuilder.delete(range);
    }).then(success => {
      if (success) {
        vscode.window.showInformationMessage('Editor content cleared!');
      } else {
        vscode.window.showErrorMessage('Failed to clear editor content.');
      }
    });
  } else {
    vscode.window.showErrorMessage('No active editor to clear.');
  }
}

/**
 * Saves the current active editor file using "Save As" functionality.
 * If the file is untitled, it prompts the user to specify a file name and location.
 * The save dialog starts from the current workspace directory.
 */
export async function saveAsCurrentFile() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("No active editor!");
    return;
  }

  const document = editor.document;
  const content = document.getText();

  let defaultUri: vscode.Uri;

  // Set the default path to the current workspace folder or the current file's directory
  if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
    defaultUri = vscode.workspace.workspaceFolders[0].uri;
  } else if (!document.isUntitled) {
    defaultUri = vscode.Uri.file(path.dirname(document.uri.fsPath));
  } else {
    defaultUri = vscode.Uri.file(path.resolve(__dirname)); // Fallback if no workspace
  }

  // Show Save Dialog
  const uri = await vscode.window.showSaveDialog({
    defaultUri: defaultUri,
    saveLabel: 'Save As'
  });

  if (!uri) {
    vscode.window.showWarningMessage('Save operation cancelled.');
    return;
  }

  // try {
  //   await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
  //   vscode.window.showInformationMessage(`File saved as ${uri.fsPath}`);
  // } catch (error: any) {
  //   vscode.window.showErrorMessage(`Failed to save file: ${error.message}`);
  // }

  try {
    // Write content to the selected path
    // await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
    await vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(content));
    vscode.window.showInformationMessage(`File saved as ${uri.fsPath}`);

    // Open the newly saved file and close the untitled document
    const newDocument = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(newDocument);
    await document.save(); // Ensure the untitled document is saved before closing
    await vscode.workspace.fs.delete(document.uri); // Optional: Delete the untitled version if it remains
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to save file: ${error.message}`);
  }
}

// Function to switch indentation for the active editor

// Function to set the indentation style of the active editor
export async function setEditorIndentationStyle(indentType: 'spaces' | 'tabs', size: number = 4) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor');
    return;
  }

  // Retrieve the options for the active editor
  const options = editor.options;

  // Set the options based on whether spaces or tabs are chosen
  if (indentType === 'spaces') {
    options.insertSpaces = true;
    options.tabSize = size; // Set the size of spaces
    vscode.window.showInformationMessage(`Set indentation to ${size} spaces`);
  } else if (indentType === 'tabs') {
    options.insertSpaces = false; // Use tabs
    options.tabSize = size; // Optionally set tab size if needed
    vscode.window.showInformationMessage(`Set indentation to tabs`);
  }

  // Apply the changes to the editor options
  editor.options = options;
}

export async function setIndentationStyle(indentType: 'spaces' | 'tabs', size: number | 'auto' = 'auto') {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage('No active editor');
    return;
  }

  const config = vscode.workspace.getConfiguration('editor', editor.document.uri);

  // Set indentation based on the provided indentType and size
  if (indentType === 'spaces') {
    await config.update('insertSpaces', true, vscode.ConfigurationTarget.Global);
    if (size !== 'auto') {
      await config.update('tabSize', size, vscode.ConfigurationTarget.Global);
    }
    vscode.window.showInformationMessage(`Set indentation to ${size} spaces`);
  } else if (indentType === 'tabs') {
    await config.update('insertSpaces', false, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Set indentation to tabs');
  }
}
// setIndentationStyle('spaces', 4);
// setIndentationStyle('spaces', 2);
// setIndentationStyle('tabs');

/**
 * Gets the hiddenPromptPrefix from the settings.
 */
export function getHiddenPromptPrefix(reset: boolean = false): string {
  const default_value = hidden_prompt_prefix;
  return reset ? default_value : vscode.workspace.getConfiguration(extension_name).get<string>('hiddenPromptPrefix', default_value);
}

/**
 * Gets the hiddenPromptSuffix from the settings.
 */
export function getHiddenPromptSuffix(reset: boolean = false): string {
  const default_value = hidden_prompt_suffix;
  return reset ? default_value : vscode.workspace.getConfiguration(extension_name).get<string>('hiddenPromptSuffix', default_value);
}

/**
 * Sets the hiddenPromptPrefix in the settings.
 * @param value The new value for hiddenPromptPrefix
 */
export async function setHiddenPromptPrefix(value: string): Promise<void> {
  await vscode.workspace.getConfiguration(extension_name).update('hiddenPromptPrefix', value, vscode.ConfigurationTarget.Global);
}

/**
 * Sets the hiddenPromptSuffix in the settings.
 * @param value The new value for hiddenPromptSuffix
 */
export async function setHiddenPromptSuffix(value: string): Promise<void> {
  await vscode.workspace.getConfiguration(extension_name).update('hiddenPromptSuffix', value, vscode.ConfigurationTarget.Global);
}

// "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\html\\index.html",
// "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\react-app\\src\\App.jsx",
// "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\react-app-ts\\src\\App.tsx",
// "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\next-app\\src\\app\\page.tsx",
// "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\svelte-app\\src\\routes\\+page.ts",
// "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\vue-app\\src\\App.vue",
// "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\vue-app-ts\\src\\App.vue",
// "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\streamlit-app\\app.py",
// "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\gradio-app\\app.py",

// overrideFileWithBackup(filePath, newContent);
// "react-app-ts": {
//   "file": "C:\\portfolio\\fmus-lib\\fmus-ts\\fmus-vscode\\templates\\react-app-ts\\src\\App.tsx",
//   "command": `${extension_name}.startReactPreviewTS`,
//   "url": 'http://localhost:8201',
// },

// // utk preview di vscode webview stlh modify file
// registerOverrideCommand(context, key, value.file, value.command);
// // utk open di external browser stlh modify file
// registerExternalCommand(context, key, value.file, value.url);


// main_file_templates["html"]["file"]
// main_file_templates["html"]["root"]
// main_file_templates["html"]["url"]

/**
 * Function to override a file with new content while creating a backup of the original file.
 * @param filePath The path to the file to override.
 * @param newContent The new content to write to the file.
 * @returns True if the override was successful, false otherwise.
 */
export function overrideFileWithBackup(filePath: string, newContent: string): boolean {
  try {
    // Ensure the file exists before proceeding
    if (!fs.existsSync(filePath)) {
      vscode.window.showErrorMessage(`File ${filePath} does not exist.`);
      return false;
    }

    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
    const backupPath = `${filePath}.${timestamp}.bak`;

    // Read existing file content
    const currentContent = fs.readFileSync(filePath, 'utf-8');

    // Backup current file with timestamp
    fs.writeFileSync(backupPath, currentContent);

    // Write new content to the file
    fs.writeFileSync(filePath, newContent);

    vscode.window.showInformationMessage(`${path.basename(filePath)} overridden successfully.`);
    return true;
  } catch (error: any) {
    console.error(`Failed to override ${filePath}:`, error);
    vscode.window.showErrorMessage(`Failed to override ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Get the directory where VSCode was invoked.
 * If a folder is opened as a workspace, it returns the workspace folder path.
 * If a file is opened directly, it returns the parent directory of that file.
 */
export function getInvokedDirectory(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  // If there is an active workspace folder, return the first workspace folder path
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri.fsPath;
  }

  // If a file is opened directly, get the parent directory of that file
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor) {
    const documentUri = activeTextEditor.document.uri;
    const filePath = documentUri.fsPath;
    return path.dirname(filePath);
  }

  // No workspace or file opened
  return undefined;
}

export function executeCommandAndInsertOutput(
  command: string,
  workingDirectory: string,
  editor: vscode.TextEditor,
  line: vscode.TextLine
): void {
  exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
    editor.edit(editBuilder => {
      const position = new vscode.Position(line.lineNumber + 1, 0);
      if (error) {
        editBuilder.insert(position, `Error: ${stderr}`);
      } else {
        editBuilder.insert(position, stdout);
      }
    });
  });
}
