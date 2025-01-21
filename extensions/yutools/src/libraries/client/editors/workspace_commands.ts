// "contributes": {
//   "commands": [
//     {
//       "command": "yutools.openFolderInNewWindow",
//       "title": "Open Folder in New Window"
//     }
//   ]
// }
// "menus": {
//     "explorer/context": [
//         {
//             "command": "yutools.openFolderInNewWindow",
//             "group": "navigation"
//         }
//     ]
// }

import * as vscode from 'vscode';

const openFolderInNewWindowCommand = vscode.commands.registerCommand(
	'yutools.openFolderInNewWindow',
	async () => {
		// Show folder selection dialog
		const folders = await vscode.window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: 'Open Folder'
		});

		if (!folders || folders.length === 0) {
			return; // User canceled the dialog
		}

		// Get the selected folder's URI
		const folderUri = folders[0];

		// Open the folder in a new window
		await vscode.commands.executeCommand('vscode.openFolder', folderUri, true);
	}
);
// "contributes": {
//   "commands": [
//     {
//       "command": "yutools.openFolderWrapper",
//       "title": "Open Folder (New Window)"
//     }
//   ]
// }
// "menus": {
//     "explorer/context": [
//         {
//             "command": "yutools.openFolderWrapper",
//             "group": "navigation"
//         }
//     ],
//     "commandPalette": [
//         {
//             "command": "yutools.openFolderWrapper",
//             "when": "workbenchState == empty"
//         }
//     ]
// }
// "keybindings": [
//     {
//         "command": "yutools.openFolderWrapper",
//         "key": "ctrl+shift+o",
//         "when": "workbenchState == empty"
//     }
// ]

const openFolderWrapperCommand = vscode.commands.registerCommand(
	'yutools.openFolderWrapper',
	async () => {
		// Show folder selection dialog (identical to File | Open Folder...)
		const folders = await vscode.window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: 'Open'
		});

		if (!folders || folders.length === 0) {
			return; // User canceled the dialog
		}

		// Get the selected folder's URI
		const folderUri = folders[0];

		// Open the folder in a new window
		await vscode.commands.executeCommand('vscode.openFolder', folderUri, false);
	}
);

export function register_workspace_comands(context: vscode.ExtensionContext) {
	context.subscriptions.push(openFolderInNewWindowCommand);
  context.subscriptions.push(openFolderWrapperCommand);
}
