import * as vscode from 'vscode';
// import * as path from "path";
// import * as fs from "fs";
// import * as os from "os";

export class TerminalManager {
  private terminals: Map<string, vscode.Terminal> = new Map();

  killProcess(terminal: vscode.Terminal): void {
    terminal.sendText('\x03');  // Send SIGINT
  }

  // Add more terminal management methods...
}
