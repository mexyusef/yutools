import * as vscode from 'vscode';
import { PasswordManager } from '../zendb';

export function addPasswordCommand(passwordManager: PasswordManager) {
  return async () => {
    const username = await vscode.window.showInputBox({ prompt: 'Enter username' });
    const password = await vscode.window.showInputBox({ prompt: 'Enter password', password: true });
    const site = await vscode.window.showInputBox({ prompt: 'Enter site/URL' });
    const notes = await vscode.window.showInputBox({ prompt: 'Enter notes (optional)', placeHolder: 'Optional' });

    if (username && password && site) {
      passwordManager.addEntry(username, password, site, notes);
      vscode.window.showInformationMessage('Password entry added successfully!');
    } else {
      vscode.window.showErrorMessage('Username, password, and site are required.');
    }
  };
}