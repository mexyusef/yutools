import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import { generateFMUSTree } from './generateFMUSTree';
import { FMUSLibrary } from '../FMUSLibrary';

// Process folder and create FMUS tree
export async function processFolderForFMUSTree() {
  const folderUri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: "Select Folder",
  });

  if (!folderUri || folderUri.length === 0) {
    vscode.window.showErrorMessage("No folder selected.");
    return;
  }

  const folderPath = folderUri[0].fsPath;

  try {
    const tempFilePath = path.join(os.tmpdir(), `index_${Date.now()}.fmus`);
    const fmusTreeContent = generateFMUSTree(folderPath, tempFilePath);

    // Create a single FMUS entry
    const fmus = new FMUSLibrary();
    fmus.addEntry("index/fmus", fmusTreeContent);

    // Export to a temporary FMUS file

    fmus.exportToFMUS(tempFilePath);

    // Open the temporary FMUS file in a new editor
    const doc = await vscode.workspace.openTextDocument(tempFilePath);
    await vscode.window.showTextDocument(doc, { preview: false });
  } catch (err: any) {
    vscode.window.showErrorMessage(`Error processing folder: ${err.message}`);
  }
}
