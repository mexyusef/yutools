import * as vscode from 'vscode';

const fileBookmarkKey = 'yutools.bookmark';
// const fileBookmarkKey = 'yutools.fileBookmark';
const folderBookmarkKey = 'yutools.folderBookmark';

const selectFilesForBookmark = vscode.commands.registerCommand('yutools.selectFilesForBookmark',
	async () => {
		const uris = await vscode.window.showOpenDialog({
			canSelectMany: true,
			openLabel: 'Open Files',
		});
		if (uris) {
			uris.forEach((uri) => vscode.workspace.openTextDocument(uri).then((doc) => vscode.window.showTextDocument(doc)));
		}
	});

const addToBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.addToBookmark',
	async () => {
		let filesToAdd: vscode.Uri[] = [];
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(fileBookmarkKey, []);

		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor && activeEditor.document.uri.scheme === 'file') {
			filesToAdd.push(activeEditor.document.uri);
		} else {
			const uris = await vscode.window.showOpenDialog({
				canSelectMany: true,
				openLabel: 'Add to Bookmark',
			});
			if (uris) {
				filesToAdd = uris;
			}
		}

		const newFiles = filesToAdd.filter((uri) => !bookmarks.some((bookmark) => bookmark.fsPath === uri.fsPath));
		if (newFiles.length > 0) {
			const updatedBookmarks = [...bookmarks, ...newFiles];
			context.workspaceState.update(fileBookmarkKey, updatedBookmarks);
			vscode.window.showInformationMessage(`${newFiles.length} file(s) added to bookmark.`);
		} else {
			vscode.window.showInformationMessage('No new files to add to bookmark.');
		}
	});

const viewBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.viewBookmark',
	async () => {
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(fileBookmarkKey, []);
		if (bookmarks.length === 0) {
			vscode.window.showInformationMessage('No files in bookmark.');
			return;
		}

		const selectedFiles = await vscode.window.showQuickPick(
			bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
			{ canPickMany: true, placeHolder: 'Select files to open from bookmark' }
		);

		if (selectedFiles) {
			// [7440:1221/171151.472:INFO:CONSOLE(101)] "%c[Extension Host] %cpilih bookmark {
			// 	"label": "c:\\ai\\yuagent\\extensions\\yutools\\package.json",
			// 	"uri": {
			// 		"$mid": 1,
			// 		"fsPath": "c:\\ai\\yuagent\\extensions\\yutools\\package.json",
			// 		"_sep": 1,
			// 		"external": "file:///c%3A/ai/yuagent/extensions/yutools/package.json",
			// 		"path": "/C:/ai/yuagent/extensions/yutools/package.json",
			// 		"scheme": "file"
			// 	}
			// }
			// selectedFiles.forEach((item) => {
			// 	console.log(`pilih bookmark ${JSON.stringify(item, null, 2)}`);
			// 	vscode.workspace.openTextDocument(item.uri).then((doc) => vscode.window.showTextDocument(doc))
			// });
			for (const item of selectedFiles) {
				try {
					// Normalize the URI
					const documentUri = vscode.Uri.file(item.uri.fsPath);
					console.log(`Opening bookmark: ${JSON.stringify(documentUri, null, 2)}`);

					const document = await vscode.workspace.openTextDocument(documentUri);
					await vscode.window.showTextDocument(document, { preview: false });
				} catch (error: any) {
					console.error(`Error opening file: ${item.label}. Error: ${error.message}`);
					vscode.window.showErrorMessage(`Failed to open file: ${item.label}`);
				}
			}
			// for (const item of selectedFiles) {
			// 	try {
			// 		const documentUri = item.uri; // Ensure we use the correct URI
			// 		console.log(`Opening bookmark: ${JSON.stringify(item, null, 2)}`);
			// 		const document = await vscode.workspace.openTextDocument(documentUri);
			// 		await vscode.window.showTextDocument(document);
			// 	} catch (error: any) {
			// 		console.error(`Error opening file: ${item.label}. Error: ${error.message}`);
			// 		vscode.window.showErrorMessage(`Failed to open file: ${item.label}`);
			// 	}
			// }
		}
	});

const removeFromBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.removeFromBookmark',
	async () => {
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(fileBookmarkKey, []);
		if (bookmarks.length === 0) {
			vscode.window.showInformationMessage('No files in bookmark to remove.');
			return;
		}

		const selectedFiles = await vscode.window.showQuickPick(
			bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
			{ canPickMany: true, placeHolder: 'Select files to remove from bookmark' }
		);

		if (selectedFiles) {
			const remainingBookmarks = bookmarks.filter((uri) => !selectedFiles.some((file) => file.uri.fsPath === uri.fsPath));
			context.workspaceState.update(fileBookmarkKey, remainingBookmarks);
			vscode.window.showInformationMessage(`${selectedFiles.length} file(s) removed from bookmark.`);
		}
	});

const addFolderToBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.addFolderToBookmark',
	async () => {
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(folderBookmarkKey, []);
		const uris = await vscode.window.showOpenDialog({
			canSelectMany: true,
			openLabel: 'Add Folders to Bookmark',
			canSelectFiles: false,
			canSelectFolders: true, // Folders only
		});

		if (uris) {
			const newFolders = uris.filter((uri) => !bookmarks.some((bookmark) => bookmark.fsPath === uri.fsPath));
			if (newFolders.length > 0) {
				const updatedBookmarks = [...bookmarks, ...newFolders];
				context.workspaceState.update(folderBookmarkKey, updatedBookmarks);
				vscode.window.showInformationMessage(`${newFolders.length} folder(s) added to bookmark.`);
			} else {
				vscode.window.showInformationMessage('No new folders to add to bookmark.');
			}
		}
	});

const viewFolderBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.viewFolderBookmark',
	async () => {
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(folderBookmarkKey, []);
		if (bookmarks.length === 0) {
			vscode.window.showInformationMessage('No folders in bookmark.');
			return;
		}

		const selectedFolders = await vscode.window.showQuickPick(
			bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
			{ canPickMany: true, placeHolder: 'Select folders to open from bookmark' }
		);

		if (selectedFolders) {
			selectedFolders.forEach(async (item) => {
				vscode.commands.executeCommand('vscode.openFolder', item.uri, true); // Open folder in new window
			});
		}
	});

const removeFolderFromBookmark = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.removeFolderFromBookmark',
	async () => {
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(folderBookmarkKey, []);

		if (bookmarks.length === 0) {
			vscode.window.showInformationMessage('No folders in bookmark.');
			return;
		}

		const selectedFolders = await vscode.window.showQuickPick(
			bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
			{ canPickMany: true, placeHolder: 'Select folders to remove from bookmark' }
		);

		if (selectedFolders) {
			const updatedBookmarks = bookmarks.filter(
				(bookmark) => !selectedFolders.some((selected) => selected.uri.fsPath === bookmark.fsPath)
			);
			context.workspaceState.update(folderBookmarkKey, updatedBookmarks);

			vscode.window.showInformationMessage(`${selectedFolders.length} folder(s) removed from bookmark.`);
		} else {
			vscode.window.showInformationMessage('No folders selected for removal.');
		}
	});

const addFolderToBookmarkFromExplorer = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.addFolderToBookmarkFromExplorer',
	async (uri: vscode.Uri) => {
		const folderBookmarkKey = 'yutools.folderBookmark';
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(folderBookmarkKey, []);

		const hasil_fstat = await vscode.workspace.fs.stat(uri);
		// if (!uri || !(hasil_fstat).type === vscode.FileType.Directory) {
		if ((hasil_fstat.type & vscode.FileType.Directory) === 0) {
			vscode.window.showErrorMessage('You can only bookmark folders from the context menu.');
			return;
		}

		if (bookmarks.some((bookmark) => bookmark.fsPath === uri.fsPath)) {
			vscode.window.showInformationMessage('This folder is already in your bookmark.');
			return;
		}

		const updatedBookmarks = [...bookmarks, uri];
		context.workspaceState.update(folderBookmarkKey, updatedBookmarks);
		vscode.window.showInformationMessage(`Folder "${uri.fsPath}" added to bookmark.`);
	});

const openTerminalInBookmarkedFolder = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.openTerminalInBookmarkedFolder',
	async () => {
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(folderBookmarkKey, []);
		if (bookmarks.length === 0) {
			vscode.window.showInformationMessage('No folders in bookmark.');
			return;
		}

		// Show a Quick Pick with bookmarks
		const selectedFolder = await vscode.window.showQuickPick(
			bookmarks.map((uri) => ({ label: uri.fsPath, uri })),
			{ placeHolder: 'Select a folder to open a terminal' }
		);

		if (selectedFolder) {
			const terminal = vscode.window.createTerminal({
				cwd: selectedFolder.uri.fsPath, // Set terminal's working directory
			});
			terminal.show(); // Show the terminal
		}
	});

const addFileToBookmarkUsingDialog = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.addFileToBookmarkUsingDialog',
	async () => {
		// const fileBookmarkKey = 'yutools.fileBookmark';
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(fileBookmarkKey, []);

		const uris = await vscode.window.showOpenDialog({
			canSelectMany: true,
			openLabel: 'Add Files to Bookmark',
			canSelectFiles: true,
			canSelectFolders: false, // Files only
		});

		if (uris) {
			const newFiles = uris.filter((uri) => !bookmarks.some((bookmark) => bookmark.fsPath === uri.fsPath));
			if (newFiles.length > 0) {
				const updatedBookmarks = [...bookmarks, ...newFiles];
				context.workspaceState.update(fileBookmarkKey, updatedBookmarks);
				vscode.window.showInformationMessage(`${newFiles.length} file(s) added to bookmark.`);
			} else {
				vscode.window.showInformationMessage('No new files to add to bookmark.');
			}
		}
	});

const addFolderToBookmarkUsingDialog = (context: vscode.ExtensionContext) => vscode.commands.registerCommand('yutools.addFolderToBookmarkUsingDialog',
	async () => {
		// const folderBookmarkKey = 'yutools.folderBookmark';
		const bookmarks = context.workspaceState.get<vscode.Uri[]>(folderBookmarkKey, []);

		const uris = await vscode.window.showOpenDialog({
			canSelectMany: true,
			openLabel: 'Add Folders to Bookmark',
			canSelectFiles: false,
			canSelectFolders: true, // Folders only
		});

		if (uris) {
			const newFolders = uris.filter((uri) => !bookmarks.some((bookmark) => bookmark.fsPath === uri.fsPath));
			if (newFolders.length > 0) {
				const updatedBookmarks = [...bookmarks, ...newFolders];
				context.workspaceState.update(folderBookmarkKey, updatedBookmarks);
				vscode.window.showInformationMessage(`${newFolders.length} folder(s) added to bookmark.`);
			} else {
				vscode.window.showInformationMessage('No new folders to add to bookmark.');
			}
		}
	});

export function register_bookmark_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(selectFilesForBookmark);
	context.subscriptions.push(addToBookmark(context));
	context.subscriptions.push(viewBookmark(context));
	context.subscriptions.push(removeFromBookmark(context));

	context.subscriptions.push(addFolderToBookmark(context));
	context.subscriptions.push(viewFolderBookmark(context));
	context.subscriptions.push(removeFolderFromBookmark(context));
	context.subscriptions.push(addFolderToBookmarkFromExplorer(context));
	context.subscriptions.push(openTerminalInBookmarkedFolder(context));

	context.subscriptions.push(addFileToBookmarkUsingDialog(context), addFolderToBookmarkUsingDialog(context));
}
