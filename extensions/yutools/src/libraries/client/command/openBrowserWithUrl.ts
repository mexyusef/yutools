import * as vscode from 'vscode';
// import { exec } from 'child_process';
import { execFile } from 'child_process';

// Command 2: Execute browser and open URL
export const openBrowserWithUrl = vscode.commands.registerCommand('yutools.commands.openBrowserWithUrl', async () => {
  const browserPath = await vscode.window.showInputBox({ prompt: 'Enter the path to the browser executable' });
  const url = await vscode.window.showInputBox({ prompt: 'Enter the URL to open' });

  if (browserPath && url) {
    execFile(browserPath, [url], (error) => {
      if (error) {
        vscode.window.showErrorMessage(`Failed to open browser: ${error.message}`);
      }
    });
  }
});

// Command 2: Execute browser and open URL
export const openBrowserWithUrlDynamic = vscode.commands.registerCommand('yutools.commands.openBrowserWithUrlDynamic',
  async (browserPath: string, url: string) => {
    if (!browserPath || !url) {
      vscode.window.showErrorMessage('Browser path or URL not provided.');
      return;
    }

    execFile(browserPath, [url], (error) => {
      if (error) {
        vscode.window.showErrorMessage(`Failed to open browser: ${error.message}`);
      }
    });
  }
);
