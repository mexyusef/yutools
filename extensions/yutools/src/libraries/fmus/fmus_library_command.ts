import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { openFMUSFileDialog } from './functions/openFMUSFileDialog';
import { parseMetadata } from './functions/parseMetadata';
import { appendToFMUSFile } from './functions/appendToFMUSFile';
import { formatFMUSEntry } from './functions/formatFMUSEntry';
import { FMUSLibrary } from './FMUSLibrary';
import { processFolderForFMUSTree } from './functions/processFolderForFMUSTree';

const addEntry = vscode.commands.registerCommand('yutools.fmus.addEntry', async () => {
  // Step 1: Open the FMUS file using the open dialog
  const fmusFile = await openFMUSFileDialog();
  if (!fmusFile) return; // User canceled the file selection

  // Step 2: Ask for title
  const title = await vscode.window.showInputBox({
    prompt: 'Enter the title for the FMUS entry'
  });
  if (!title) return; // User canceled the input

  // Step 3: Ask for metadata (optional)
  const metadata = await vscode.window.showInputBox({
    prompt: 'Enter metadata (optional, e.g., [tags:tag1,tag2|author:JohnDoe|date:2024-12-25])'
  });

  // Step 4: Ask for content
  const content = await vscode.window.showInputBox({
    prompt: 'Enter the content for the FMUS entry'
  });

  if (!content) return; // User canceled the input

  // Step 5: Parse and validate the metadata (only if provided)
  const parsedMetadata = metadata ? parseMetadata(metadata) : {};

  // Step 6: Format the FMUS entry
  const entry = formatFMUSEntry(parsedMetadata, title, content);

  // Step 7: Append the entry to the FMUS file
  appendToFMUSFile(fmusFile, entry);

  vscode.window.showInformationMessage(`FMUS entry "${title}" added successfully.`);
});

const processFolder = vscode.commands.registerCommand('yutools.fmus.processFolder', async () => {
  // Step 1: Prompt user to open a folder
  const folderUri = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    title: 'Select a folder to process',
  });

  if (!folderUri || folderUri.length === 0) {
    vscode.window.showErrorMessage('No folder selected.');
    return;
  }

  const folderPath = folderUri[0].fsPath;

  // Step 2: Process the folder
  const fmusLibrary = new FMUSLibrary();
  await fmusLibrary.processFolder(folderPath);

  // Step 3: Export the result to a temporary FMUS file
  const tempFilePath = path.join(os.tmpdir(), `exported_${Date.now()}.fmus`);
  fmusLibrary.exportToFMUS(tempFilePath);

  // Step 4: Show the content of the FMUS file in a new editor
  // const fmusContent = exportToFMUS(result);
  // const tempDoc = await vscode.workspace.openTextDocument({
  //   content: fmusContent,
  //   language: 'fmus'
  // });
  const document = await vscode.workspace.openTextDocument(tempFilePath);
  const activeEditor = vscode.window.activeTextEditor;

  await vscode.window.showTextDocument(document, {
    preview: false,
    viewColumn: activeEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One,
  });

  vscode.window.showInformationMessage(`FMUS content loaded into editor: ${tempFilePath}`);
});

export function register_fmus_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(addEntry);
  context.subscriptions.push(processFolder);
  vscode.commands.registerCommand("yutools.fmus.processFolderForFMUSTree", processFolderForFMUSTree);
}
