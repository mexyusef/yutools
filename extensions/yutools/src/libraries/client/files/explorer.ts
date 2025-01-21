import * as vscode from 'vscode';
import * as path from 'path';

// const nodeState = new Map<string, boolean>();
// let nodeState = new Map<string, boolean>();

// // Track expansion
// treeView.onDidExpandElement((e) => nodeState.set(e.element.id, true));
// // Track collapse
// treeView.onDidCollapseElement((e) => nodeState.set(e.element.id, false));

// export function collapseAllNodes(treeView: vscode.TreeView<vscode.TreeItem>): void {
// 	treeView.visible && treeView.reveal(undefined, { expand: false });
// }

// export function restoreNodeState(treeView: vscode.TreeView<vscode.TreeItem>, items: vscode.TreeItem[]): void {
// 	items.forEach((item) => {
// 		if (nodeState.get(item.id)) {
// 			treeView.reveal(item, { expand: true });
// 		}
// 	});
// }

// export async function highlightNode(treeView: vscode.TreeView<vscode.TreeItem>, searchQuery: string): Promise<void> {
// 	const allItems = await getAllItems(treeView); // Implement a function to fetch all items in the TreeView
// 	const targetItem = allItems.find((item) => item.label.includes(searchQuery));

// 	if (targetItem) {
// 		treeView.reveal(targetItem, { select: true, focus: true, expand: true });
// 	} else {
// 		vscode.window.showInformationMessage('Node not found');
// 	}
// }

// export function activate(context: vscode.ExtensionContext) {
// 	const treeDataProvider = new MyTreeDataProvider();
// 	const treeView = vscode.window.createTreeView('myTreeView', {
// 		treeDataProvider,
// 	});

// 	// Commands
// 	context.subscriptions.push(
// 		vscode.commands.registerCommand('extension.collapseAll', () => collapseAllNodes(treeView)),
// 		vscode.commands.registerCommand('extension.restoreState', () => restoreNodeState(treeView, treeDataProvider.getItems())),
// 		vscode.commands.registerCommand('extension.searchNode', async () => {
// 			const searchQuery = await vscode.window.showInputBox({ prompt: 'Enter node name to search' });
// 			if (searchQuery) {
// 				highlightNode(treeView, searchQuery);
// 			}
// 		})
// 	);

// 	// Track Node State
// 	treeView.onDidExpandElement((e) => nodeState.set(e.element.id, true));
// 	treeView.onDidCollapseElement((e) => nodeState.set(e.element.id, false));
// }

// // Utility functions
// function collapseAllNodes(treeView: vscode.TreeView<vscode.TreeItem>): void {
// 	treeView.visible && treeView.reveal(undefined, { expand: false });
// }

// function restoreNodeState(treeView: vscode.TreeView<vscode.TreeItem>, items: vscode.TreeItem[]): void {
// 	items.forEach((item) => {
// 		if (nodeState.get(item.id)) {
// 			treeView.reveal(item, { expand: true });
// 		}
// 	});
// }

// async function highlightNode(treeView: vscode.TreeView<vscode.TreeItem>, searchQuery: string): Promise<void> {
// 	const allItems = await treeView.dataProvider?.getChildren();
// 	const targetItem = allItems?.find((item) => item.label.includes(searchQuery));

// 	if (targetItem) {
// 		treeView.reveal(targetItem, { select: true, focus: true, expand: true });
// 	} else {
// 		vscode.window.showInformationMessage('Node not found');
// 	}
// }

// Command to search and highlight a file/folder in the File Explorer
// vscode.commands.executeCommand('workbench.files.action.collapseExplorerFolders');
const revealFileCommand = vscode.commands.registerCommand('yutools.revealFileInExplorer', async () => {
	// Ask the user to enter a file or folder name
	const filePath = await vscode.window.showInputBox({
		prompt: 'Enter the file path to reveal in Explorer'
	});

	if (filePath) {
		// Convert to URI
		const uri = vscode.Uri.file(filePath);
		// Check if file exists
		const fileExists = await vscode.workspace.fs.stat(uri).then(() => true, () => false);
		if (fileExists) {
			// Reveal the file/folder in the File Explorer
			vscode.commands.executeCommand('revealInExplorer', uri);
		} else {
			vscode.window.showErrorMessage(`File or folder not found: ${filePath}`);
		}
	}
});

// Command to reveal a specific file/folder in the File Explorer
const revealFileCommand2 = vscode.commands.registerCommand('yutools.revealFileInExplorer2', async () => {
	// Prompt user for the file/folder path to reveal
	const filePath = await vscode.window.showInputBox({
		prompt: 'Enter the full path of the file or folder to reveal in Explorer'
	});

	if (filePath) {
		// Convert the string to a URI (file path)
		const uri = vscode.Uri.file(filePath);
		try {
			// Check if file/folder exists
			const fileExists = await vscode.workspace.fs.stat(uri).then(() => true, () => false);
			if (fileExists) {
				// Reveal the file/folder in the File Explorer
				vscode.commands.executeCommand('revealInExplorer', uri);
			} else {
				vscode.window.showErrorMessage(`File or folder not found: ${filePath}`);
			}
		} catch (error: any) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
		}
	}
});

// Command to collapse all folders in the File Explorer
const collapseAllCommand = vscode.commands.registerCommand('yutools.collapseAllFolders', () => {
	vscode.commands.executeCommand('workbench.files.action.collapseExplorerFolders');
});

// Command to reveal a specific file/folder in the File Explorer using fuzzy search
const searchAndRevealFileCommand = vscode.commands.registerCommand('yutools.searchAndRevealFileInExplorer', async () => {

	// Get all files and folders in the workspace
	const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**'); // Exclude node_modules or other directories you don't want

	if (files.length === 0) {
		vscode.window.showErrorMessage('No files found in the workspace.');
		return;
	}

	// Extract file names and paths for QuickPick options
	const fileNames = files.map(file => ({
		label: path.basename(file.fsPath),
		description: path.dirname(file.fsPath),
		fileUri: file
	}));

	// Show QuickPick UI for fuzzy search
	const selected = await vscode.window.showQuickPick(fileNames, {
		placeHolder: 'Search for a file/folder to reveal',
		matchOnDescription: true,
		matchOnDetail: true
	});

	if (!selected) {
		vscode.window.showErrorMessage('No file/folder selected.');
		return;
	}

	// Reveal the selected file/folder in the File Explorer
	vscode.commands.executeCommand('revealInExplorer', selected.fileUri);
});


export function register_explorer_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		collapseAllCommand,
		// revealFileCommand,
		revealFileCommand2,
		searchAndRevealFileCommand
	);
}

