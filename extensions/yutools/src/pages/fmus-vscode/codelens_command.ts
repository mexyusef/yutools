import * as vscode from 'vscode';
import { extension_name } from '@/constants';
// import { insertStringsAtCursor } from './fmus_commands';
import { getConfigValue } from '@/libraries/client/settings/configUtils';

async function refreshCodeLens() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
      const position = editor.selection.active;
      const range = new vscode.Range(position, position);
      await editor.edit((editBuilder) => {
          editBuilder.insert(position, ' '); // Insert a space
      });
      await editor.edit((editBuilder) => {
          editBuilder.delete(range); // Remove the space
      });
  }
}

// C:\portfolio\fmus-lib\fmus-ts\fmus-vscode\src\configuration\codelens.ts
const togglePrimaryCommand = vscode.commands.registerCommand(`${extension_name}.toggleShowPrimaryCommands`, async () => {
  const configName = 'showPrimaryCommands';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
});

const toggleShowSecondaryCommands = vscode.commands.registerCommand(`${extension_name}.toggleShowSecondaryCommands`, async () => {
  const configName = 'showSecondaryCommands';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
});

const toggleShowLLMRawQuery = vscode.commands.registerCommand(`${extension_name}.toggleShowLLMRawQuery`, async () => {
  const configName = 'showLLMRawQuery';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
});

const toggleShowLLMCodeQuery = vscode.commands.registerCommand(`${extension_name}.toggleShowLLMCodeQuery`, async () => {
  const configName = 'showLLMCodeQuery';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
});

const toggleShowLLMStreamingQuery = vscode.commands.registerCommand(`${extension_name}.toggleShowLLMStreamingQuery`, async () => {
  const configName = 'showLLMStreamingQuery';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
});

const toggleShowFmusVscodeCommands = vscode.commands.registerCommand(`${extension_name}.toggleShowFmusVscodeCommands`, async () => {
  const configName = 'showFmusVscodeCommands';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
});

const toggleShowFmusVscodeProjectWork = vscode.commands.registerCommand(`${extension_name}.toggleShowFmusVscodeProjectWork`, async () => {
  const configName = 'showFmusVscodeProjectWork';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
});

const toggleShowInputBoxForPrompt = vscode.commands.registerCommand(`${extension_name}.toggleShowInputBoxForPrompt`, async () => {
  const configName = 'showInputBoxForPrompt';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
  // await vscode.commands.executeCommand('editor.action.codeLens.refresh');
  // await refreshCodeLens();
});

const toggleShowLLMResponseBeside = vscode.commands.registerCommand(`${extension_name}.toggleShowLLMResponseBeside`, async () => {
  const configName = 'showLLMResponseBeside';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
  // await vscode.commands.executeCommand('editor.action.codeLens.refresh');
  // await refreshCodeLens();
});

const toggleShowLLMFmusQuery = vscode.commands.registerCommand(`${extension_name}.toggleShowLLMFmusQuery`, async () => {
  const configName = 'showLLMFmusQuery';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
});

const toggleShowLLMMultimodalQuery = vscode.commands.registerCommand(`${extension_name}.toggleShowLLMMultimodalQuery`, async () => {
  const configName = 'showLLMMultimodalQuery';
  const config = vscode.workspace.getConfiguration(extension_name);
  const currentSetting = getConfigValue<boolean>(configName, true);
  await config.update(configName, !currentSetting, vscode.ConfigurationTarget.Global);
  vscode.commands.executeCommand('editor.action.reloadCodeLensProviders');
});

export function register_toggle_codelens(context: vscode.ExtensionContext) {
  context.subscriptions.push(togglePrimaryCommand);
  context.subscriptions.push(toggleShowSecondaryCommands);
  context.subscriptions.push(toggleShowLLMRawQuery);
  context.subscriptions.push(toggleShowLLMCodeQuery);
  context.subscriptions.push(toggleShowLLMStreamingQuery);
  context.subscriptions.push(toggleShowLLMFmusQuery);
  context.subscriptions.push(toggleShowLLMMultimodalQuery);
  context.subscriptions.push(toggleShowFmusVscodeCommands);
  context.subscriptions.push(toggleShowFmusVscodeProjectWork);
  context.subscriptions.push(toggleShowInputBoxForPrompt);
  context.subscriptions.push(toggleShowLLMResponseBeside);
}
