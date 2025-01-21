import * as vscode from 'vscode';
import { PasswordManager } from '../zendb';

export function deletePasswordCommand(passwordManager: PasswordManager) {
  return async () => {
    const entries = passwordManager.getEntries();
    if (entries.length > 0) {
      const items = entries.map(entry => ({
        label: `${entry.site} - ${entry.username}`,
        detail: `Password: ${entry.password}\nNotes: ${entry.notes || 'N/A'}`,
        id: entry.id,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select an entry to delete',
      });

      if (selected) {
        passwordManager.deleteEntry(selected.id!);
        vscode.window.showInformationMessage('Password entry deleted successfully!');
      }
    } else {
      vscode.window.showInformationMessage('No password entries found.');
    }
  };
}