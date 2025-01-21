import * as vscode from 'vscode';


// Command to format the document
const formatDocument = vscode.commands.registerCommand('yutools.editors.formatDocument', async () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    await vscode.commands.executeCommand('editor.action.formatDocument');
  } else {
    vscode.window.showInformationMessage('No active editor to format.');
  }
});

const formatDocumentWith = vscode.commands.registerCommand('yutools.editors.formatDocumentWith', async () => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    // Format the document using the default formatter
    await vscode.commands.executeCommand('editor.action.formatDocument');
  } else {
    vscode.window.showInformationMessage('No active editor to format.');
  }
});

export function register_format_commands(context: vscode.ExtensionContext) {
  // Create the status bar item
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'yutools.editors.toggleFormatOnSaveQuick';
  statusBarItem.tooltip = 'Click to toggle Format on Save (Global) or open menu for more options';

  // Determine the active scope for the setting
  const getActiveScope = (): string => {
    const config = vscode.workspace.getConfiguration('editor');
    const inspect = config.inspect('formatOnSave');
    if (inspect?.workspaceFolderValue !== undefined) {
      return 'Workspace Folder';
    } else if (inspect?.workspaceValue !== undefined) {
      return 'Workspace';
    } else if (inspect?.globalValue !== undefined) {
      return 'Global';
    }
    return 'Default';
  };

  // Function to update the status bar item
  const updateStatusBar = () => {
    const config = vscode.workspace.getConfiguration('editor');
    const formatOnSave = config.get<boolean>('formatOnSave', false);
    const activeScope = getActiveScope();

    statusBarItem.text = `$(tools) Format: ${formatOnSave ? 'On' : 'Off'}`;
    statusBarItem.tooltip = `Format on Save is ${formatOnSave ? 'enabled' : 'disabled'} (Scope: ${activeScope}).\nClick to toggle (Global) or open menu for more options.`;
    statusBarItem.backgroundColor = formatOnSave
      ? undefined // Default background color when enabled
      : new vscode.ThemeColor('statusBarItem.errorBackground'); // Red when disabled
    statusBarItem.show();
  };

  // Command to toggle "Format on Save" globally (quick toggle)
  const toggleFormatOnSaveQuick = vscode.commands.registerCommand('yutools.editors.toggleFormatOnSaveQuick', async () => {
    const config = vscode.workspace.getConfiguration('editor');
    const currentSetting = config.get<boolean>('formatOnSave', false);
    await config.update('formatOnSave', !currentSetting, vscode.ConfigurationTarget.Global);

    vscode.window.showInformationMessage(`Format on Save is now ${!currentSetting ? 'enabled' : 'disabled'} globally.`);
    updateStatusBar();
  });

  // Command to show a menu for managing "Format on Save"
  const showFormatOnSaveMenu = vscode.commands.registerCommand('yutools.editors.showFormatOnSaveMenu', async () => {
    const options = [
      { label: 'Enable (Global)', action: () => updateFormatOnSave(true, vscode.ConfigurationTarget.Global) },
      { label: 'Disable (Global)', action: () => updateFormatOnSave(false, vscode.ConfigurationTarget.Global) },
      { label: 'Enable (Workspace)', action: () => updateFormatOnSave(true, vscode.ConfigurationTarget.Workspace) },
      { label: 'Disable (Workspace)', action: () => updateFormatOnSave(false, vscode.ConfigurationTarget.Workspace) },
      { label: 'Enable (Workspace Folder)', action: () => updateFormatOnSave(true, vscode.ConfigurationTarget.WorkspaceFolder) },
      { label: 'Disable (Workspace Folder)', action: () => updateFormatOnSave(false, vscode.ConfigurationTarget.WorkspaceFolder) },
    ];

    const selection = await vscode.window.showQuickPick(options, {
      placeHolder: 'Manage Format on Save settings',
    });

    if (selection) {
      selection.action();
    }
  });

  // Utility function to update "Format on Save" setting
  async function updateFormatOnSave(enabled: boolean, scope: vscode.ConfigurationTarget) {
    const config = vscode.workspace.getConfiguration('editor');
    await config.update('formatOnSave', enabled, scope);

    vscode.window.showInformationMessage(
      `Format on Save has been ${enabled ? 'enabled' : 'disabled'} in ${scope === vscode.ConfigurationTarget.Global
        ? 'Global'
        : scope === vscode.ConfigurationTarget.Workspace
          ? 'Workspace'
          : 'Workspace Folder'
      } scope.`
    );

    updateStatusBar(); // Update the status bar after changing the setting
  }

  // Command to enable "Format on Save"
  const enableFormatOnSave = vscode.commands.registerCommand('yutools.editors.enableFormatOnSave', async () => {
    const scope = await vscode.window.showQuickPick(
      ['Global', 'Workspace', 'Workspace Folder'],
      {
        placeHolder: 'Select the scope to enable Format on Save',
      }
    );

    if (!scope) return; // User cancelled

    const target =
      scope === 'Global'
        ? vscode.ConfigurationTarget.Global
        : scope === 'Workspace'
          ? vscode.ConfigurationTarget.Workspace
          : vscode.ConfigurationTarget.WorkspaceFolder;

    await updateFormatOnSave(true, target);
  });

  // Command to disable "Format on Save"
  const disableFormatOnSave = vscode.commands.registerCommand('yutools.editors.disableFormatOnSave', async () => {
    const scope = await vscode.window.showQuickPick(
      ['Global', 'Workspace', 'Workspace Folder'],
      {
        placeHolder: 'Select the scope to disable Format on Save',
      }
    );

    if (!scope) return; // User cancelled

    const target =
      scope === 'Global'
        ? vscode.ConfigurationTarget.Global
        : scope === 'Workspace'
          ? vscode.ConfigurationTarget.Workspace
          : vscode.ConfigurationTarget.WorkspaceFolder;

    await updateFormatOnSave(false, target);
  });

  // Register commands
  context.subscriptions.push(
    toggleFormatOnSaveQuick,
    showFormatOnSaveMenu,
    enableFormatOnSave,
    disableFormatOnSave,
    formatDocument,
    formatDocumentWith,
    statusBarItem
  );

  // Initialize the status bar item and listen for configuration changes
  updateStatusBar();
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('editor.formatOnSave')) {
      updateStatusBar();
    }
  });
}
