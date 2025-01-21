import * as vscode from 'vscode';
import { makeApiRequest } from './apiutils';
import { createNewUntitledFile } from './vsutils';
import open, { openApp, apps } from 'open';

export function openAddressInBrowser(url: string) {
  open(url)
    .then(() => {
      vscode.window.showInformationMessage(`Opening ${url} in your browser...`);
    })
    .catch((err: any) => {
      vscode.window.showErrorMessage(`Failed to open ${url}: ${err}`);
    });
}

export async function openWebpage(url: string) {
  // const encodedQuery = encodeURIComponent(query);
  // const googleSearchUrl = `https://www.google.com/search?q=${encodedQuery}`;
  await vscode.env.openExternal(vscode.Uri.parse(url));
}

export async function query_llm(prompt: string) {

  let editor = vscode.window.activeTextEditor;
  // if (!editor) {
  //   vscode.window.showErrorMessage('No open text editor found.');
  //   return;
  // }
  if (!editor) {
    editor = await createNewUntitledFile();
    if (!editor) return;
  }

  const selection = editor.selection;
  const position = selection.active;

  return vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Processing your request...",
    cancellable: false
  }, async (progress) => {

    progress.report({ increment: 0 });

    try {
      const result = await makeApiRequest(prompt);

      editor.edit(editBuilder => {
        editBuilder.insert(position, `\n${result}`);
      });

    } catch (error: any) {
      vscode.window.showErrorMessage(`Error: ${error.message}`);
    }

    progress.report({ increment: 100 });
  });
}
