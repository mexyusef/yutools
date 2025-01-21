import * as vscode from 'vscode';
import BrowserProfileManagerIncognito from '../BrowserProfileManagerIncognito';
import { EditorInserter } from '../../editors/editor_inserter';

const browserManager = BrowserProfileManagerIncognito.getInstance();

export const listBrowserProfilesCommand = vscode.commands.registerCommand('yutools.browsers.listBrowserProfiles', async () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage('No active text editor found.');
    return;
  }

  try {
    const chromeProfiles = browserManager.listChromeProfiles();
    const firefoxProfiles = browserManager.listFirefoxProfiles();

    const profilesText = [
      '=== Chrome Profiles ===',
      ...chromeProfiles,
      '',
      '=== Firefox Profiles ===',
      ...firefoxProfiles,
    ].join('\n');

    EditorInserter.insertTextInNewEditor(profilesText);
    // editor.edit((editBuilder) => {
    //   editBuilder.insert(editor.selection.active, profilesText);
    // });

    vscode.window.showInformationMessage('Browser profiles listed successfully.');
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to list profiles: ${error.message}`);
  }
});