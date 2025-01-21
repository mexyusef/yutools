import * as vscode from 'vscode';

async function findOpenEditorsSection(): Promise<vscode.TreeItem | undefined> {
  // Get the Explorer view
  const explorerView = vscode.extensions.getExtension('vscode.explorer')?.exports;
  if (!explorerView) {
    return undefined;
  }

  // Get the Open Editors section
  const openEditorsSection = explorerView.getViewState().openEditors;
  return openEditorsSection;
}


export function register_opened_editors_commands(context: vscode.ExtensionContext) {
  // Register the command to show opened editors
  let disposable = vscode.commands.registerCommand('yutools.editors.showOpenedEditors', async () => {
    // // Execute the built-in command to show opened editors
    // await vscode.commands.executeCommand('workbench.files.action.showOpenEditors');
    // vscode.window.showInformationMessage('Opened editors shown.');

    await vscode.commands.executeCommand('workbench.files.action.focusOpenEditorsView');
    vscode.window.showInformationMessage('Opened editors shown.');

    // // Focus on the Explorer view
    // await vscode.commands.executeCommand('workbench.view.explorer');
    // // Expand the Open Editors section
    // await vscode.commands.executeCommand('list.expand', 'openEditors');

    // // Focus on the Explorer view
    // await vscode.commands.executeCommand('workbench.view.explorer');
    // // Wait for the Explorer view to load
    // await new Promise(resolve => setTimeout(resolve, 500));
    // // Find the Open Editors section in the Explorer view
    // const openEditorsSection = await findOpenEditorsSection();
    // if (openEditorsSection) {
    //   // Expand the Open Editors section
    //   await openEditorsSection.expand();
    //   vscode.window.showInformationMessage('Opened editors shown.');
    // } else {
    //   vscode.window.showErrorMessage('Open Editors section not found.');
    // }


  });

  context.subscriptions.push(disposable);
}
