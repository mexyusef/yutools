import * as vscode from 'vscode';

/**
 * Handles enabling or disabling extensions based on the provided action command.
 * @param command The VS Code command to execute (e.g., 'workbench.extensions.action.enableExtension').
 * @param actionMessage The message to display after completing the action.
 */
async function manageExtensions(command: string, actionMessage: string) {
  // Get all installed extensions
  const extensions = vscode.extensions.all;

  // Filter active extensions
  const activeExtensions = extensions.filter(ext => ext.isActive);

  // Create QuickPick items
  const quickPickItems = activeExtensions.map(ext => ({
    label: ext.packageJSON.displayName || ext.id,
    description: ext.id,
  }));

  // Show QuickPick for multi-selection
  const selectedExtensions = await vscode.window.showQuickPick(
    quickPickItems,
    { canPickMany: true, placeHolder: `Select extensions to ${actionMessage}` }
  );

  if (!selectedExtensions) {
    return; // User canceled
  }

  // Execute the command for selected extensions
  for (const selected of selectedExtensions) {
    await vscode.commands.executeCommand(command, selected.description); // Extension ID
  }

  vscode.window.showInformationMessage(`Selected extensions have been ${actionMessage}.`);
}

const enableExtensions = vscode.commands.registerCommand('yutools.enableExtensions', async () => {
  await manageExtensions(
    'workbench.extensions.action.enableExtension',
    'enabled'
  );
});

const disableExtensions = vscode.commands.registerCommand('yutools.disableExtensions', async () => {
  await manageExtensions(
    'workbench.extensions.action.disableExtension',
    'disabled'
  );
});

export function register_extensions_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(enableExtensions, disableExtensions);
}