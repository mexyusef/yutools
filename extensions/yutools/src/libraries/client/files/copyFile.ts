import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export const copyFileFromContext = vscode.commands.registerCommand("yutools.files.copyFileFromContext",
	async (uri: vscode.Uri) => {
		const currentFilePath = uri.fsPath;
		const folderPath = path.dirname(currentFilePath);

		const targetPath = await vscode.window.showInputBox({
			prompt: "Enter the target file path or name",
			placeHolder: "Relative or absolute path, e.g., ../newFolder/file.js",
		});

		if (targetPath) {
			let resolvedPath: string;

			// Resolve relative or absolute path
			if (path.isAbsolute(targetPath)) {
				resolvedPath = targetPath;
			} else {
				resolvedPath = path.resolve(folderPath, targetPath);
			}

			try {
				fs.copyFileSync(currentFilePath, resolvedPath);
				vscode.window.showInformationMessage(
					`File copied to: ${resolvedPath}`
				);
			} catch (error: any) {
				vscode.window.showErrorMessage(
					`Failed to copy file: ${error.message}`
				);
			}
		}
	}
);
