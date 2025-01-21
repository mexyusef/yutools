import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// export const createNewFileFromContext = vscode.commands.registerCommand("yutools.files.createNewFileFromContext",
// 	async (uri: vscode.Uri) => {
// 		const folderPath = path.dirname(uri.fsPath);
// 		const fileName = await vscode.window.showInputBox({
// 			prompt: "Enter the name for the new file",
// 			placeHolder: "example.js",
// 		});

// 		if (fileName) {
// 			const newFilePath = path.join(folderPath, fileName);
// 			fs.writeFileSync(newFilePath, ""); // Create an empty file
// 			vscode.workspace.openTextDocument(newFilePath).then(doc => { vscode.window.showTextDocument(doc); });
// 			// vscode.window.showInformationMessage(`File created: ${newFilePath}`);
// 		}
// 	}
// );

export const createNewFileFromContext = vscode.commands.registerCommand(
	"yutools.files.createNewFileFromContext",
	async (uri: vscode.Uri | undefined) => {
		let folderPath;

		// Check if uri.fsPath is undefined
		if (uri?.fsPath) {
			folderPath = path.dirname(uri.fsPath);
		} else {
			// Get the folder of the active file
			const activeEditor = vscode.window.activeTextEditor;

			if (activeEditor) {
				folderPath = path.dirname(activeEditor.document.uri.fsPath);
			} else {
				// Fallback: Show a folder picker dialog
				const folderUri = await vscode.window.showOpenDialog({
					canSelectFiles: false,
					canSelectFolders: true,
					canSelectMany: false,
					openLabel: "Select a folder to create the new file",
				});

				if (folderUri && folderUri[0]) {
					folderPath = folderUri[0].fsPath;
				} else {
					vscode.window.showErrorMessage("No folder selected. Operation canceled.");
					return;
				}
			}
		}

		const fileName = await vscode.window.showInputBox({
			prompt: `Enter the name for the new file to be created in ${folderPath}`,
			placeHolder: "example.js",
		});

		if (fileName) {
			const newFilePath = path.join(folderPath, fileName);

			try {
				fs.writeFileSync(newFilePath, ""); // Create an empty file
				const doc = await vscode.workspace.openTextDocument(newFilePath);
				await vscode.window.showTextDocument(doc);
				// vscode.window.showInformationMessage(`File created: ${newFilePath}`);
			} catch (error: any) {
				vscode.window.showErrorMessage(`Failed to create file: ${error.message}`);
			}
		} else {
			vscode.window.showErrorMessage("No file name entered. Operation canceled.");
		}
	}
);
