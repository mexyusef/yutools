import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';


const TREE_VIEW_ID = 'fileTreeViewExplorer';
export class FileExplorerProvider implements vscode.TreeDataProvider<FileItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<FileItem | null | undefined> = new vscode.EventEmitter<FileItem | null | undefined>();
  readonly onDidChangeTreeData: vscode.Event<FileItem | null | undefined> = this._onDidChangeTreeData.event;

  private rootUri: vscode.Uri;
  private maxDepth: number;

  constructor(rootUri: vscode.Uri, maxDepth: number) {
    this.rootUri = rootUri;
    this.maxDepth = maxDepth;
  }

  setRootUri(uri: vscode.Uri): void {
    this.rootUri = uri;
    this.refresh();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined); // Emit undefined to indicate a full refresh
  }

  getTreeItem(element: FileItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: FileItem): Thenable<FileItem[]> {
    if (!this.rootUri) {
      return Promise.resolve([]);
    }

    if (element) {
      // Return children of the given folder
      return Promise.resolve(this.getFiles(element.resourceUri.fsPath, element.depth));
    } else {
      // Return root-level children
      return Promise.resolve(this.getFiles(this.rootUri.fsPath, 0));
    }
  }

  private getFiles(dirPath: string, depth: number): FileItem[] {
    if (depth >= this.maxDepth) {
      return [];
    }

    if (fs.existsSync(dirPath)) {
      return fs.readdirSync(dirPath).map((fileName) => {
        const filePath = path.join(dirPath, fileName);
        const stat = fs.statSync(filePath);
        return new FileItem(
          vscode.Uri.file(filePath),
          stat.isDirectory() ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
          depth + 1
        );
      });
    }

    return [];
  }
}

const autoSetRoot = vscode.commands.registerCommand('yutools.fileExplorer.autoSetRoot', async (uri: vscode.Uri) => {
  if (!uri || !fs.existsSync(uri.fsPath)) {
    vscode.window.showErrorMessage('Invalid directory or file.');
    return;
  }

  const rootUri = fs.statSync(uri.fsPath).isDirectory()
    ? uri // Use folder URI directly
    : vscode.Uri.file(path.dirname(uri.fsPath)); // Use parent directory for files

  await vscode.commands.executeCommand('yutools.fileExplorer.setRoot', rootUri);
  vscode.window.showInformationMessage(`Root set programmatically to: ${rootUri.fsPath}`);
});

const autoSetRootFromActiveEditor = vscode.commands.registerCommand('yutools.fileExplorer.autoSetRootFromActiveEditor', async () => {
  // Get the currently active editor
  const activeEditor = vscode.window.activeTextEditor;

  if (!activeEditor || !activeEditor.document || !activeEditor.document.uri) {
    vscode.window.showErrorMessage('No active editor or file detected.');
    return;
  }

  const fileUri = activeEditor.document.uri;

  if (fileUri.scheme !== 'file') {
    vscode.window.showErrorMessage('Active file is not a valid file on the filesystem.');
    return;
  }

  const parentUri = vscode.Uri.file(path.dirname(fileUri.fsPath));

  if (!fs.existsSync(parentUri.fsPath)) {
    vscode.window.showErrorMessage('Parent folder does not exist.');
    return;
  }

  // Programmatically set the parent directory as the root
  await vscode.commands.executeCommand('yutools.fileExplorer.setRoot', parentUri);
  vscode.window.showInformationMessage(`Root set to parent folder of active file: ${parentUri.fsPath}`);
});

const autoSetRootFromOpenDialog = vscode.commands.registerCommand('yutools.fileExplorer.autoSetRootFromOpenDialog', async () => {
  // Show an open folder dialog
  const selectedFolders = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Select Folder',
  });

  if (!selectedFolders || selectedFolders.length === 0) {
    vscode.window.showErrorMessage('No folder selected.');
    return;
  }

  const selectedFolder = selectedFolders[0];

  if (!fs.existsSync(selectedFolder.fsPath)) {
    vscode.window.showErrorMessage('Selected folder does not exist.');
    return;
  }

  // Set the selected folder as the root
  await vscode.commands.executeCommand('yutools.fileExplorer.setRoot', selectedFolder);
  vscode.window.showInformationMessage(`Root set to selected folder: ${selectedFolder.fsPath}`);
});

class FileItem extends vscode.TreeItem {
  constructor(
    public readonly resourceUri: vscode.Uri,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly depth: number
  ) {
    super(resourceUri, collapsibleState);
    this.tooltip = this.resourceUri.fsPath;
    this.description = depth === 0 ? undefined : `Depth: ${depth}`;
    this.contextValue = collapsibleState === vscode.TreeItemCollapsibleState.None ? 'file' : 'folder';
  }
}

// {
//   "contributes": {
//     "commands": [
//       { "command": "fileExplorer.setRoot", "title": "Set as File Explorer Root" },
//       { "command": "fileExplorer.refresh", "title": "Refresh File Explorer" }
//     ],
//     "menus": {
//       "explorer/context": [
//         {
//           "command": "fileExplorer.setRoot",
//           "when": "resourceUri",
//           "group": "navigation"
//         }
//       ]
//     }
//   }
// }

export function register_explorer_tree_commands(context: vscode.ExtensionContext) {
  const maxDepth = vscode.workspace.getConfiguration('yutools').get<number>('maxDepth') || 2;

  const initialRoot = vscode.workspace.workspaceFolders?.[0]?.uri || vscode.Uri.file('/');

  const fileExplorerProvider = new FileExplorerProvider(initialRoot, maxDepth);

  const treeView = vscode.window.createTreeView(TREE_VIEW_ID, {
    treeDataProvider: fileExplorerProvider,
  });

  context.subscriptions.push(vscode.commands.registerCommand('yutools.fileExplorer.refresh', () => fileExplorerProvider.refresh()));

  context.subscriptions.push(vscode.commands.registerCommand('yutools.fileExplorer.setRoot', (uri: vscode.Uri) => {
      const rootUri = uri.fsPath && fs.statSync(uri.fsPath).isDirectory()
        ? uri // Use folder URI
        : vscode.Uri.file(path.dirname(uri.fsPath)); // Use parent directory for files

      fileExplorerProvider.setRootUri(rootUri);
      vscode.window.showInformationMessage(`Root set to: ${rootUri.fsPath}`);
    })
  );

  context.subscriptions.push(autoSetRoot);

  context.subscriptions.push(autoSetRootFromActiveEditor);

  context.subscriptions.push(autoSetRootFromOpenDialog);
}

// vscode.commands.executeCommand('myExtension.autoSetRoot', vscode.Uri.file('/path/to/directory'));
// context.subscriptions.push(
//   vscode.commands.registerCommand('myExtension.someOperation', async () => {
//     // Perform some operations (e.g., create a new directory)
//     const newDirectoryUri = vscode.Uri.file('/path/to/new/directory');

//     // Programmatically set the new directory as the root
//     await vscode.commands.executeCommand('myExtension.autoSetRoot', newDirectoryUri);
//   })
// );
