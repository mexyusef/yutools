import * as vscode from 'vscode';
import { extension_name } from '../../constants';

const toggle_primary_sidebar = vscode.commands.registerCommand(`${extension_name}.toggle_primary_sidebar`, async () => {
  const config = vscode.workspace.getConfiguration('workbench');
  const currentValue = config.get<boolean>('activityBar.visible');

  try {
      // Toggle the `activityBar.visible` setting
      await config.update('activityBar.visible', !currentValue, vscode.ConfigurationTarget.Global);
  } catch (error) {
      vscode.window.showErrorMessage('Failed to toggle primary sidebar.');
      console.error(error);
  }
});

export function register_sidebar_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(toggle_primary_sidebar);
}
