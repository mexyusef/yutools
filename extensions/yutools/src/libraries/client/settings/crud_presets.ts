import * as vscode from 'vscode';

// Helper function to update presets in settings
async function updatePresets(presetType: 'prefixPresets' | 'suffixPresets' | 'replacementPresets', presets: Record<string, string>) {
  const config = vscode.workspace.getConfiguration('yutools');
  await config.update(presetType, presets, vscode.ConfigurationTarget.Global);
}

// Command to add a new preset
async function addPreset() {
  const config = vscode.workspace.getConfiguration('yutools');

  // Ask the user for the preset type
  const presetType = await vscode.window.showQuickPick(['Prefix', 'Suffix', 'Replacement'], {
    placeHolder: 'Select the type of preset to add',
  });

  if (!presetType) {
    return; // User canceled
  }

  const presetKey = presetType.toLowerCase() + 'Presets' as 'prefixPresets' | 'suffixPresets' | 'replacementPresets';
  const currentPresets = config.get<Record<string, string>>(presetKey, {});

  // Ask the user for the new preset name
  const presetName = await vscode.window.showInputBox({
    prompt: `Enter a name for the new ${presetType.toLowerCase()} preset`,
  });

  if (!presetName) {
    return; // User canceled
  }

  // Ask the user for the new preset value
  const presetValue = await vscode.window.showInputBox({
    prompt: `Enter the value for the "${presetName}" ${presetType.toLowerCase()} preset`,
  });

  if (!presetValue) {
    return; // User canceled
  }

  // Add the new preset
  currentPresets[presetName] = presetValue;
  await updatePresets(presetKey, currentPresets);

  vscode.window.showInformationMessage(`"${presetName}" ${presetType.toLowerCase()} preset added.`);
}

// Command to edit an existing preset
async function editPreset() {
  const config = vscode.workspace.getConfiguration('yutools');

  // Ask the user for the preset type
  const presetType = await vscode.window.showQuickPick(['Prefix', 'Suffix', 'Replacement'], {
    placeHolder: 'Select the type of preset to edit',
  });

  if (!presetType) {
    return; // User canceled
  }

  const presetKey = presetType.toLowerCase() + 'Presets' as 'prefixPresets' | 'suffixPresets' | 'replacementPresets';
  const currentPresets = config.get<Record<string, string>>(presetKey, {});

  // Ask the user to select a preset to edit
  const selectedPreset = await vscode.window.showQuickPick(Object.keys(currentPresets), {
    placeHolder: `Select a ${presetType.toLowerCase()} preset to edit`,
  });

  if (!selectedPreset) {
    return; // User canceled
  }

  // Ask the user for the new preset value
  const newPresetValue = await vscode.window.showInputBox({
    prompt: `Enter the new value for the "${selectedPreset}" ${presetType.toLowerCase()} preset`,
    value: currentPresets[selectedPreset],
  });

  if (!newPresetValue) {
    return; // User canceled
  }

  // Update the preset
  currentPresets[selectedPreset] = newPresetValue;
  await updatePresets(presetKey, currentPresets);

  vscode.window.showInformationMessage(`"${selectedPreset}" ${presetType.toLowerCase()} preset updated.`);
}

// Command to delete a preset
async function deletePreset() {
  const config = vscode.workspace.getConfiguration('yutools');

  // Ask the user for the preset type
  const presetType = await vscode.window.showQuickPick(['Prefix', 'Suffix', 'Replacement'], {
    placeHolder: 'Select the type of preset to delete',
  });

  if (!presetType) {
    return; // User canceled
  }

  const presetKey = presetType.toLowerCase() + 'Presets' as 'prefixPresets' | 'suffixPresets' | 'replacementPresets';
  const currentPresets = config.get<Record<string, string>>(presetKey, {});

  // Ask the user to select a preset to delete
  const selectedPreset = await vscode.window.showQuickPick(Object.keys(currentPresets), {
    placeHolder: `Select a ${presetType.toLowerCase()} preset to delete`,
  });

  if (!selectedPreset) {
    return; // User canceled
  }

  // Confirm deletion
  const confirmDelete = await vscode.window.showQuickPick(['Yes', 'No'], {
    placeHolder: `Are you sure you want to delete the "${selectedPreset}" ${presetType.toLowerCase()} preset?`,
  });

  if (confirmDelete !== 'Yes') {
    return; // User canceled
  }

  // Delete the preset
  delete currentPresets[selectedPreset];
  await updatePresets(presetKey, currentPresets);

  vscode.window.showInformationMessage(`"${selectedPreset}" ${presetType.toLowerCase()} preset deleted.`);
}

// Register the commands
export function registerPresetManagementCommands(context: vscode.ExtensionContext) {
  const addPresetCommand = vscode.commands.registerCommand('yutools.settings.addPreset', addPreset);
  const editPresetCommand = vscode.commands.registerCommand('yutools.settings.editPreset', editPreset);
  const deletePresetCommand = vscode.commands.registerCommand('yutools.settings.deletePreset', deletePreset);

  context.subscriptions.push(addPresetCommand, editPresetCommand, deletePresetCommand);
}