import * as vscode from 'vscode';

export async function saveFMUSFileDialog(): Promise<string | undefined> {
  const fileUri = await vscode.window.showSaveDialog({
    saveLabel: 'Save FMUS File',
    filters: {
      'FMUS Files': ['fmus'],
      'Text Files': ['txt'],
    }
  });

  return fileUri ? fileUri.fsPath : undefined; // Return file path or undefined if canceled
}