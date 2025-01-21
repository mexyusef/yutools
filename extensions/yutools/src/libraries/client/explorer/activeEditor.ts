import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.performOperation', async (uri?: vscode.Uri) => {
      // Fallback to active text editor if no URI is passed
      if (!uri) {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
          uri = activeEditor.document.uri;
        }
      }

      if (!uri) {
        vscode.window.showErrorMessage("No file or folder selected or open in the editor.");
        return;
      }

      const isFolder = (await vscode.workspace.fs.stat(uri)).type === vscode.FileType.Directory;

      if (isFolder) {
        await handleFolder(uri);
      } else {
        await handleFile(uri);
      }
    })
  );
}

async function handleFolder(folderUri: vscode.Uri) {
  const option = await vscode.window.showQuickPick(["Create File", "Open Terminal", "Run Command"], {
    placeHolder: "Select an operation for the folder",
  });

  if (!option) return;

  switch (option) {
    case "Create File":
      const fileName = await vscode.window.showInputBox({ prompt: "Enter the new file name" });
      if (fileName) {
        const newFileUri = vscode.Uri.joinPath(folderUri, fileName);
        await vscode.workspace.fs.writeFile(newFileUri, Buffer.from(""));
        vscode.window.showInformationMessage(`File ${fileName} created in ${folderUri.fsPath}`);
      }
      break;

    case "Open Terminal":
      vscode.window.createTerminal({ cwd: folderUri.fsPath }).show();
      break;

    case "Run Command":
      const command = await vscode.window.showInputBox({ prompt: "Enter the command to run" });
      if (command) {
        const terminal = vscode.window.createTerminal({ cwd: folderUri.fsPath });
        terminal.show();
        terminal.sendText(command);
      }
      break;
  }
}

async function handleFile(fileUri: vscode.Uri) {
  const option = await vscode.window.showQuickPick(["Copy File", "Parent Folder Operations"], {
    placeHolder: "Select an operation for the file",
  });

  if (!option) return;

  const parentFolderUri = vscode.Uri.joinPath(fileUri, "..");

  switch (option) {
    case "Copy File":
      const newFileName = await vscode.window.showInputBox({ prompt: "Enter the name for the copied file" });
      if (newFileName) {
        const newFileUri = vscode.Uri.joinPath(parentFolderUri, newFileName);
        const data = await vscode.workspace.fs.readFile(fileUri);
        await vscode.workspace.fs.writeFile(newFileUri, data);
        vscode.window.showInformationMessage(`File copied to ${newFileUri.fsPath}`);
      }
      break;

    case "Parent Folder Operations":
      await handleFolder(parentFolderUri);
      break;
  }
}

// "contributes": {
//   "commands": [
//     {
//       "command": "extension.performOperation",
//       "title": "Perform Operation on Selected File/Folder"
//     }
//   ],
//     "menus": {
//     "explorer/context": [
//       {
//         "command": "extension.performOperation",
//         "when": "resourceLangId != ''",
//         "group": "navigation"
//       }
//     ],
//       "commandPalette": [
//         {
//           "command": "extension.performOperation",
//           "when": "true",
//           "title": "Perform Operation on File/Folder"
//         }
//       ]
//   }
// }
