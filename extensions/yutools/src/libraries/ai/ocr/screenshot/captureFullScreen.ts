import * as vscode from 'vscode';
import { captureFullScreen, captureSelectedRegion } from '.';
import * as path from 'path';
// import * as fs from 'fs';

export const captureFullScreenCommand = vscode.commands.registerCommand('yutools.captureFullScreen', async () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder is open.');
    return;
  }

  const outputFile = path.join(workspaceFolders[0].uri.fsPath, `screenshot_${Date.now()}.png`);

  try {
    const savedFile = await captureFullScreen(outputFile);
    vscode.window.showInformationMessage(`Screenshot saved: ${savedFile}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to capture screen: ${error}`);
  }
});
