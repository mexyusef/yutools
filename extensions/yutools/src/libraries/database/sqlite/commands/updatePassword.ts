import * as vscode from 'vscode';
import { PasswordManager } from '../zendb';
import { PasswordEntry } from '../zendb/schemas/PasswordSchema';

export function updatePasswordCommand(passwordManager: PasswordManager) {
  return async () => {
    const entries = passwordManager.getEntries();
    if (entries.length > 0) {
      const items = entries.map(entry => ({
        label: `${entry.site} - ${entry.username}`,
        detail: `Password: ${entry.password}\nNotes: ${entry.notes || 'N/A'}`,
        id: entry.id,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select an entry to update',
      });

      if (selected) {
        const updates: Partial<PasswordEntry> = {};
        const username = await vscode.window.showInputBox({ prompt: 'Enter new username', value: entries.find(e => e.id === selected.id)?.username });
        const password = await vscode.window.showInputBox({ prompt: 'Enter new password', password: true });
        const site = await vscode.window.showInputBox({ prompt: 'Enter new site/URL', value: entries.find(e => e.id === selected.id)?.site });
        const notes = await vscode.window.showInputBox({ prompt: 'Enter new notes (optional)', placeHolder: 'Optional', value: entries.find(e => e.id === selected.id)?.notes });

        if (username) updates.username = username;
        if (password) updates.password = password;
        if (site) updates.site = site;
        if (notes !== undefined) updates.notes = notes;

        if (Object.keys(updates).length > 0) {
          passwordManager.updateEntry(selected.id!, updates);
          vscode.window.showInformationMessage('Password entry updated successfully!');
        } else {
          vscode.window.showInformationMessage('No changes made.');
        }
      }
    } else {
      vscode.window.showInformationMessage('No password entries found.');
    }
  };
}