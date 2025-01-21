import * as vscode from 'vscode';

// Store terminal cwd in a map or similar structure
export const terminalCwdMap: Map<string, string> = new Map();

// Function to get the terminal's cwd
export function getTerminalCwd(terminal: vscode.Terminal): string {
  return terminalCwdMap.get(terminal.name) || '';  // Return cwd stored for the terminal
}