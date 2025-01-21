import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.performOperation', async () => {
      // Get the currently selected file/folder
      const uri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: true,
        canSelectMany: false,
        openLabel: "Select a file or folder",
      });

      if (!uri || uri.length === 0) {
        vscode.window.showErrorMessage("No file or folder selected.");
        return;
      }

      const selectedUri = uri[0];
      const isFolder = (await vscode.workspace.fs.stat(selectedUri)).type === vscode.FileType.Directory;

      if (isFolder) {
        await handleFolder(selectedUri);
      } else {
        await handleFile(selectedUri);
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
//   ]
// }
