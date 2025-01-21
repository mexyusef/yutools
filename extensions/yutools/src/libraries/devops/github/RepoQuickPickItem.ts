import * as vscode from 'vscode';

export interface RepoQuickPickItem extends vscode.QuickPickItem {
  fullName: string; // Custom property to store the full repository identifier
}
