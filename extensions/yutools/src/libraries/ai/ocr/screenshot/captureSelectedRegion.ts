import * as vscode from 'vscode';
import { captureFullScreen, captureSelectedRegion } from '.';
import * as path from 'path';
// import * as fs from 'fs';

export const captureSelectedRegionCommand = vscode.commands.registerCommand('yutools.captureSelectedRegion', async () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder is open.');
    return;
  }

  const outputFile = path.join(workspaceFolders[0].uri.fsPath, `screenshot_${Date.now()}.png`);

  try {
    const savedFile = await captureSelectedRegion(outputFile);
    vscode.window.showInformationMessage(`Screenshot saved: ${savedFile}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to capture selected region: ${error}`);
  }
});
