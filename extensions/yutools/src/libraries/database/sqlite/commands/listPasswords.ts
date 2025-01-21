import * as vscode from 'vscode';
import { PasswordManager } from '../zendb';

export function listPasswordsCommand(passwordManager: PasswordManager) {
  return async () => {
    const entries = passwordManager.getEntries();
    if (entries.length > 0) {
      const items = entries.map(entry => ({
        label: `${entry.site} - ${entry.username}`,
        detail: `Password: ${entry.password}\nNotes: ${entry.notes || 'N/A'}`,
        // detail: `Notes: ${entry.notes || 'N/A'}`,
        id: entry.id,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select an entry to copy password',
      });

      if (selected) {
        vscode.env.clipboard.writeText(selected.detail.split('\n')[0].split(': ')[1]); // Copy password to clipboard
        vscode.window.showInformationMessage('Password copied to clipboard!');
      }
    } else {
      vscode.window.showInformationMessage('No password entries found.');
    }
  };
}