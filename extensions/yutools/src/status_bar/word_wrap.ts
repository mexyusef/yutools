import * as vscode from 'vscode';

const command_name = 'yutools.status_bar.wordwrap.toggle'

/**
 * Activates the extension
 * @param context - The extension context provided by VS Code
 */
export function register_word_wrap_commands(context: vscode.ExtensionContext): void {
  const wordWrapStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  wordWrapStatusBarItem.command = command_name;

  // Function to update the status bar item
  const updateStatusBar = (): void => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      wordWrapStatusBarItem.hide();
      return;
    }

    const config = vscode.workspace.getConfiguration('editor', editor.document.uri);
    const isWordWrapEnabled = config.get<string>('wordWrap') === 'on';

    wordWrapStatusBarItem.text = 'Wrap: ' + (isWordWrapEnabled ? 'ON' : 'OFF');
    wordWrapStatusBarItem.backgroundColor = new vscode.ThemeColor(
      isWordWrapEnabled ? 'statusBarItem.errorBackground' : 'statusBarItem.warningBackground'
    );
    wordWrapStatusBarItem.tooltip = `Word wrap for active editor is currently ${(isWordWrapEnabled ? 'ON' : 'OFF')}`;
    wordWrapStatusBarItem.show();
  };

  // Command to toggle word wrap
  const toggleWordWrap = async (): Promise<void> => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found to toggle word wrap.');
      return;
    }

    const config = vscode.workspace.getConfiguration('editor', editor.document.uri);
    const currentWordWrap = config.get<string>('wordWrap');
    const newWordWrap = currentWordWrap === 'on' ? 'off' : 'on';

    await config.update('wordWrap', newWordWrap, vscode.ConfigurationTarget.Global);
    updateStatusBar();
  };

  // Register the command
  const disposable = vscode.commands.registerCommand(command_name, toggleWordWrap);
  context.subscriptions.push(disposable);

  // Update the status bar when the active editor changes
  vscode.window.onDidChangeActiveTextEditor(updateStatusBar, null, context.subscriptions);

  // Initial update
  updateStatusBar();

  // Add the status bar item to the subscriptions
  context.subscriptions.push(wordWrapStatusBarItem);
}
