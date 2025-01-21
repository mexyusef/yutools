import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads the `package.json` file from a given workspace folder.
 * @param {string} folderPath - The path to the workspace folder.
 * @returns {Promise<Object>} - Parsed JSON content of `package.json`.
 */
async function readPackageJson(folderPath: string) {
	const packageJsonPath = path.join(folderPath, 'package.json');

	try {
		const data = await fs.promises.readFile(packageJsonPath, 'utf-8');
		return JSON.parse(data);
	} catch (err: any) {
		vscode.window.showErrorMessage(`Failed to read package.json: ${err.message}`);
		return null;
	}
}

/**
 * Generates a single-line npm install command with all dependencies and devDependencies.
 * @param {Object} packageJson - The content of `package.json`.
 * @returns {string} - The npm install command.
 */
function generateInstallCommand(packageJson: { dependencies: {}; devDependencies: {}; }) {
	if (!packageJson) {
		return '';
	}

	const deps = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
	const devDeps = packageJson.devDependencies ? Object.keys(packageJson.devDependencies) : [];
	const allDeps = deps.concat(devDeps);

	return `npm install ${allDeps.join(' ')}`;
}

function generateInstallCommandDep(packageJson: { dependencies: {}; devDependencies: {}; }) {
	if (!packageJson) {
		return '';
	}
	const deps = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
	// const devDeps = packageJson.devDependencies ? Object.keys(packageJson.devDependencies) : [];
	// const allDeps = deps.concat(devDeps);
	return `npm install ${deps.join(' ')}`;
}

function generateInstallCommandDevDep(packageJson: { dependencies: {}; devDependencies: {}; }) {
	if (!packageJson) {
		return '';
	}
	// const deps = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
	const devDeps = packageJson.devDependencies ? Object.keys(packageJson.devDependencies) : [];
	// const allDeps = deps.concat(devDeps);
	return `npm install ${devDeps.join(' ')}`;
}

const installCommand = async (which: string) => {
	// const folders = vscode.workspace.workspaceFolders;
	// if (!folders || folders.length === 0) {
	// 	vscode.window.showErrorMessage('No workspace folder is open.');
	// 	return;
	// }
	// const folderPath = folders[0].uri.fsPath;
	const folderUri = await vscode.window.showOpenDialog({
		canSelectFolders: true,
		canSelectFiles: false,
		canSelectMany: false,
		openLabel: 'Select Folder'
	});
	if (!folderUri || folderUri.length === 0) {
		vscode.window.showErrorMessage('No folder selected.');
		return;
	}
	const folderPath = folderUri[0].fsPath;
	const packageJson = await readPackageJson(folderPath);
	if (packageJson) {
		let installCommand;
		if (which === 'all') {
			installCommand = generateInstallCommand(packageJson);
		}
		else if (which === 'dep') {
			installCommand = generateInstallCommandDep(packageJson);
		}
		else { // devDep
			installCommand = generateInstallCommandDevDep(packageJson);
		}
		vscode.window.showInformationMessage(installCommand);
	}
}

/**
 * Activates the VS Code extension and registers commands.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
const packageJsonAll = vscode.commands.registerCommand('yutools.packageJsonAll', () => installCommand('all'));
const packageJsonDep = vscode.commands.registerCommand('yutools.packageJsonDep', () => installCommand('dep'));
const packageJsonDevDep = vscode.commands.registerCommand('yutools.packageJsonDevDep', () => installCommand('devDep'));

export function register_packagejson_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(packageJsonAll);
	context.subscriptions.push(packageJsonDep);
	context.subscriptions.push(packageJsonDevDep);
}
