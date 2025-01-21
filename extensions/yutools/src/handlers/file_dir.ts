import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function getBasename(path: string): string {
	// Normalize the path for consistency
	const normalizedPath = path.replace(/\\/g, '/');  // For Windows-style backslashes

	// Split the path by the '/' character and get the last part
	const parts = normalizedPath.split('/');

	// Return the last non-empty part
	return parts.filter(Boolean).pop() || '';
}

export function getExplorerFilePath(uri: vscode.Uri): { fullPath: string, holdingDirectory: string } {
	const fullPath = uri.fsPath;
	const holdingDirectory = path.dirname(fullPath);

	return { fullPath, holdingDirectory };
}

// let disposableExplorer = vscode.commands.registerCommand('extension.runMyExplorerCommand', (uri: vscode.Uri) => {
//     const { fullPath, holdingDirectory } = getExplorerFilePath(uri);

//     vscode.window.showInformationMessage(`Explorer: Full path: ${fullPath}, Directory: ${holdingDirectory}`);
// });
// {
// 	"contributes": {
// 	  "menus": {
// 		"explorer/context": [
// 		  {
// 			"command": "extension.runMyExplorerCommand",
// 			"group": "navigation@1"
// 		  }
// 		]
// 	  }
// 	}
//   }


// vscode.window.activeTextEditor?.document.uri.fsPath gives the full path of the file currently opened in the active editor.
// path.dirname(fullPath) gives the holding directory.
export function getEditorFilePath(): { fullPath: string, holdingDirectory: string } | null {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const document = editor.document;
		const fullPath = document.uri.fsPath;
		const holdingDirectory = path.dirname(fullPath);

		return { fullPath, holdingDirectory };
	} else {
		return null; // No active editor
	}
}

// let disposableEditor = vscode.commands.registerCommand('extension.runMyEditorCommand', () => {
//     const fileInfo = getEditorFilePath();

//     if (fileInfo) {
//         const { fullPath, holdingDirectory } = fileInfo;
//         vscode.window.showInformationMessage(`Editor: Full path: ${fullPath}, Directory: ${holdingDirectory}`);
//     } else {
//         vscode.window.showErrorMessage('No active editor');
//     }
// });
// {
// 	"contributes": {
// 	  "menus": {
// 		"editor/context": [
// 		  {
// 			"command": "extension.runMyEditorCommand",
// 			"group": "navigation@1"
// 		  }
// 		]
// 	  }
// 	}
//   }

export function getExplorerDirectoryPath(uri: vscode.Uri): { directoryPath: string } | null {
	const fullPath = uri.fsPath;

	// Check if the selected item is a directory
	if (fs.statSync(fullPath).isDirectory()) {
		return { directoryPath: fullPath };
	} else {
		return null; // Selected item is not a directory
	}
}

/**
 * Get the directory where VSCode was invoked.
 * If a folder is opened as a workspace, it returns the workspace folder path.
 * If a file is opened directly, it returns the parent directory of that file.
 */
export function getInvokedDirectory(): string | undefined {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	// If there is an active workspace folder, return the first workspace folder path
	if (workspaceFolders && workspaceFolders.length > 0) {
		return workspaceFolders[0].uri.fsPath;
	}

	// If a file is opened directly, get the parent directory of that file
	const activeTextEditor = vscode.window.activeTextEditor;
	if (activeTextEditor) {
		const documentUri = activeTextEditor.document.uri;
		const filePath = documentUri.fsPath;
		return path.dirname(filePath);
	}

	// No workspace or file opened
	return undefined;
}


/**
 * Check if a folder exists and contains a package.json file.
 * @param {string} folderPath - The folder to check (relative or absolute).
 * @param {string} cwd - The current working directory to resolve relative paths.
 * @returns {boolean} - True if the folder exists and contains a package.json file, otherwise false.
 */
// export function checkFolderAndPackageJson(folderPath: string, cwd: string = process.cwd()): boolean {
export function checkFolderAndPackageJson(folderPath: string, cwd: string): boolean {
	try {
		// Print the current working directory for debugging
		console.log(`checkFolderAndPackageJson: Current working directory (cwd): ${cwd}`);

		// Resolve the folder path relative to cwd (if necessary)
		const absoluteFolderPath = path.resolve(cwd, folderPath);
		console.log(`checkFolderAndPackageJson: Resolved folder path: ${absoluteFolderPath}`);

		// Check if folder exists
		const folderExists = fs.existsSync(absoluteFolderPath) && fs.statSync(absoluteFolderPath).isDirectory();
		if (!folderExists) {
			console.log("checkFolderAndPackageJson: Folder does not exist.");
			return false;
		}

		// Check if package.json exists in the folder
		const packageJsonPath = path.join(absoluteFolderPath, 'package.json');
		const packageJsonExists = fs.existsSync(packageJsonPath) && fs.statSync(packageJsonPath).isFile();

		if (!packageJsonExists) {
			console.log("checkFolderAndPackageJson: package.json not found in the folder.");
		}

		return packageJsonExists;
	} catch (error) {
		console.error('checkFolderAndPackageJson: Error checking folder and package.json:', error);
		return false;
	}
}

// // Example usage:
// const folderPath = '/absolute/path/to/your/folder'; // Replace with your folder path
// if (checkFolderAndPackageJson(folderPath)) {
//     console.log('Condition met: Folder and package.json exist!');
// } else {
//     console.log('Condition not met.');
// }
/**
 * Check if a folder exists and has a package.json file
 * @param {string} folderPath - Absolute path of the folder
 * @returns {boolean} - True if the folder exists and contains package.json, else false
 */
export function checkFolderAndPackageJson2(folderPath: string) {
	try {
		// Check if folder exists
		const folderExists = fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();

		if (!folderExists) {
			console.log(`checkFolderAndPackageJson: ${folderPath} does not exist or is not a directory`);
			return false;
		}

		// Check if package.json exists in the folder
		const packageJsonPath = path.join(folderPath, 'package.json');
		const packageJsonExists = fs.existsSync(packageJsonPath) && fs.statSync(packageJsonPath).isFile();

		if (!packageJsonExists) {
			console.log(`checkFolderAndPackageJson: package.json does not exist in ${folderPath}`);
			return false;
		}

		console.log(`checkFolderAndPackageJson: ${folderPath}/ and package.json exist`);
		return true;

	} catch (error) {
		console.error(`checkFolderAndPackageJson: Error checking ${folderPath}/ and package.json:`, error);
		return false;
	}
}

/**
 * Check if a folder exists at the given path.
 * @param {string} folderPath - The absolute path to the folder.
 * @returns {boolean} - True if the folder exists, otherwise false.
 */
export function checkFolderExists2(folderPath: string): boolean {
	try {
		return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
	} catch (error) {
		console.error('Error checking if folder exists:', error);
		return false;
	}
}

/**
 * Check if a folder exists, supporting both relative and absolute paths.
 * @param {string} folderPath - The folder to check (relative or absolute).
 * @param {string} cwd - The current working directory to resolve relative paths.
 * @returns {boolean} - True if the folder exists, otherwise false.
 */
// export function checkFolderExists(folderPath: string, cwd: string = process.cwd()): boolean {
export function checkFolderExists(folderPath: string, cwd: string): boolean {
	try {
		// Print the current working directory for debugging
		console.log(`checkFolderExists: Current working directory (cwd): ${cwd}`);

		// Resolve the folder path relative to cwd (if necessary)
		const absoluteFolderPath = path.resolve(cwd, folderPath);
		console.log(`checkFolderExists: Resolved folder path: ${absoluteFolderPath}`);

		// Check if the folder exists and is a directory
		const folderExists = fs.existsSync(absoluteFolderPath) && fs.statSync(absoluteFolderPath).isDirectory();

		if (!folderExists) {
			console.log("checkFolderExists: Folder does not exist.");
		}

		return folderExists;
	} catch (error) {
		console.error('checkFolderExists: Error checking folder existence:', error);
		return false;
	}
}


// console.log(ensureWslPath("C:\\Users\\myfolder\\project")); 
// // Output: /mnt/c/Users/myfolder/project
// console.log(ensureWslPath("..\\relative\\path")); 
// // Output: ../relative/path
// console.log(ensureWslPath("/already/wsl/path"));
// // Output: /already/wsl/path
export function ensureWslPath(folderPath: string): string {
	// Normalize the path to handle different OS conventions
	const normalizedPath = path.normalize(folderPath);

	// Check if it's an absolute Windows path
	const windowsDriveMatch = normalizedPath.match(/^([a-zA-Z]):\\(.*)/);
	if (windowsDriveMatch) {
		const driveLetter = windowsDriveMatch[1].toLowerCase();
		const restOfPath = windowsDriveMatch[2].replace(/\\/g, '/');
		return `/mnt/${driveLetter}/${restOfPath}`;
	}

	// Otherwise, assume it's a relative path and just convert backslashes to slashes
	return normalizedPath.replace(/\\/g, '/');
}

/**
 * Join one folder with another folder or file.
 * @param {string} baseFolder - The base folder to join with another path.
 * @param {string} relativePath - The relative folder or file to join with the base folder.
 * @returns {string} - The joined path.
 */
export function joiner(baseFolder: string, relativePath: string): string {
	try {
		// Resolve and join the paths
		const joinedPath = path.join(baseFolder, relativePath);

		// Return the final joined path
		return joinedPath;
	} catch (error) {
		console.error('Error joining paths:', error);
		return '';
	}
}