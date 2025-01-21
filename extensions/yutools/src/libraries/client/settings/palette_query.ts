import * as vscode from 'vscode';

const openCommandPaletteWithSearch = vscode.commands.registerCommand('yutools.palette_query.openCommandPaletteWithSearch', async () => {
  // const searchQuery = '>redis';
  // await vscode.commands.executeCommand('workbench.action.showCommands', searchQuery);
  const searchQuery = await vscode.window.showInputBox({
    placeHolder: 'Enter a search query (e.g., redis)',
    prompt: 'Search for commands in the Command Palette',
  });
  if (searchQuery) {
    await vscode.commands.executeCommand('workbench.action.showCommands', ">" + searchQuery);
  } else {
    vscode.window.showInformationMessage('No search query provided.');
  }

});

const openSettingsWithSearch = vscode.commands.registerCommand('yutools.palette_query.openSettingsWithSearch', async () => {
  // const searchQuery = 'redis';
  // await vscode.commands.executeCommand('workbench.action.openSettings', searchQuery);
  const searchQuery = await vscode.window.showInputBox({
    placeHolder: 'Enter a search query (e.g., redis)',
    prompt: 'Search for settings',
});
if (searchQuery) {
    await vscode.commands.executeCommand('workbench.action.openSettings', searchQuery);
} else {
    vscode.window.showInformationMessage('No search query provided.');
}
});

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(openCommandPaletteWithSearch);
  context.subscriptions.push(openSettingsWithSearch);
}

export function register_palette_query_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    openCommandPaletteWithSearch,
    openSettingsWithSearch,
  );
}
// {
//   "contributes": {
//     "commands": [
//       {
//         "command": "yutools.palette_query.openSettingsWithSearch",
//         "title": "Open Settings with Redis Search"
//       }
//     ]
//   }
// }
// {
//   "contributes": {
//     "keybindings": [
//       {
//         "command": "yutools.palette_query.openSettingsWithSearch",
//         "key": "ctrl+alt+r", // Customize the keybinding
//         "mac": "cmd+alt+r",
//         "when": "editorTextFocus"
//       }
//     ]
//   }
// }

// {
//   "contributes": {
//     "keybindings": [
//       {
//         "command": "yutools.palette_query.openCommandPaletteWithSearch",
//         "key": "ctrl+alt+r", // Customize the keybinding
//         "mac": "cmd+alt+r",
//         "when": "editorTextFocus"
//       }
//     ]
//   }
// }

// {
//   "contributes": {
//     "commands": [
//       {
//         "command": "yutools.palette_query.openCommandPaletteWithSearch",
//         "title": "Open Command Palette with Redis Search"
//       }
//     ]
//   }
// }
