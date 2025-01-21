import * as vscode from 'vscode';
import { EditorInserter } from '../editors/editor_inserter';

// C:\ai\yuagent\extensions\yutools\src\libraries\ai\glhf\handleGLHFPromptConfigPresets.ts
export async function switchPreset() {
  const config = vscode.workspace.getConfiguration('yutools');

  // Get prefix and suffix presets from settings
  const prefixPresets = config.get<Record<string, string>>('prefixPresets', {});
  const suffixPresets = config.get<Record<string, string>>('suffixPresets', {});
  const replacementPresets = config.get<Record<string, string>>('replacementPresets', {});

  // Ask the user whether to update prefix or suffix
  const presetType = await vscode.window.showQuickPick(['Prefix', 'Suffix', 'Replacement'], {
    placeHolder: 'Select the type of preset to update (Prefix, Suffix, or Replacement)',
  });

  if (!presetType) {
    return; // User canceled
  }

  // Show QuickPick for the selected preset type
  const presets =
    presetType === 'Prefix'
      ? prefixPresets
      : presetType === 'Suffix'
      ? suffixPresets
      : replacementPresets;
  const selectedPreset = await vscode.window.showQuickPick(Object.keys(presets), {
    placeHolder: `Select a ${presetType.toLowerCase()} preset`,
  });

  if (!selectedPreset) {
    return; // User canceled
  }

  // Update the corresponding setting
  const presetValue = presets[selectedPreset];
  if (presetType === 'Prefix') {
    await config.update('currentPromptPrefix', presetValue, vscode.ConfigurationTarget.Global);
  } else if (presetType === 'Suffix') {
    await config.update('currentPromptSuffix', presetValue, vscode.ConfigurationTarget.Global);
  } else {
    await config.update('currentPromptReplacement', presetValue, vscode.ConfigurationTarget.Global);
  }

  vscode.window.showInformationMessage(`${presetType} preset updated to: "${selectedPreset}"`);
}

async function resetPreset() {
  const config = vscode.workspace.getConfiguration('yutools');
  const presetType = await vscode.window.showQuickPick(['Prefix', 'Suffix', 'Replacement'], {
    placeHolder: 'Select the type of preset to reset (Prefix, Suffix, or Replacement)',
  });

  if (!presetType) {
    return; // User canceled
  }

  if (presetType === 'Prefix') {
    await config.update('currentPromptPrefix', '', vscode.ConfigurationTarget.Global);
  } else if (presetType === 'Suffix') {
    await config.update('currentPromptSuffix', '', vscode.ConfigurationTarget.Global);
  } else {
    await config.update('currentPromptReplacement', '', vscode.ConfigurationTarget.Global);
  }

  vscode.window.showInformationMessage(`${presetType} reset to empty.`);
}

export async function showAllPresetValues() {
  const config = vscode.workspace.getConfiguration('yutools');

  // Get current prefix, suffix, and replacement values
  const prefix = config.get<string>('currentPromptPrefix', '');
  const suffix = config.get<string>('currentPromptSuffix', '');
  const replacement = config.get<string>('currentPromptReplacement', '');

  // Format the values for display
  const result = `
Current Preset Values:
----------------------
*** Prefix: ${prefix || '(empty)'}
*** Suffix: ${suffix || '(empty)'}
*** Replacement: ${replacement || '(empty)'}
`;

  // Display the result in a new editor on the right
  EditorInserter.insertTextInNewEditor(result);
}

const switchPresetCommand = vscode.commands.registerCommand('yutools.settings.switchPreset', switchPreset);
const resetPresetCommand = vscode.commands.registerCommand('yutools.settings.resetPreset', resetPreset);
const showAllPresetValuesCommand = vscode.commands.registerCommand('yutools.settings.showPresets', showAllPresetValues);

export function registerPresetCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(switchPresetCommand);
  context.subscriptions.push(resetPresetCommand);
  context.subscriptions.push(showAllPresetValuesCommand);
}