import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';

export async function openFMUSFileDialog(): Promise<string | undefined> {
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    openLabel: 'Open FMUS File',
    filters: {
      'FMUS Files': ['fmus'],
      'Text Files': ['txt'],
    }
  });

  if (fileUri && fileUri.length > 0) {
    return fileUri[0].fsPath; // Return selected file path
  }

  return undefined; // User canceled file selection
}