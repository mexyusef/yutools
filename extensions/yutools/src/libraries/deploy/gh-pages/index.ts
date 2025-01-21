import * as vscode from 'vscode';
import * as child_process from 'child_process';

function runCommand(command: string, cwd: string): Promise<string> {
	return new Promise((resolve, reject) => {
		child_process.exec(command, { cwd }, (error, stdout, stderr) => {
			if (error) {
				reject(stderr || error.message);
			} else {
				resolve(stdout);
			}
		});
	});
}

const deployQuick = vscode.commands.registerCommand('yutools.ghpages.deployQuick',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders || workspaceFolders.length === 0) {
			vscode.window.showErrorMessage('No workspace folder found. Open a project and try again.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;
		const distDir = 'dist'; // Default build directory
		const branch = 'gh-pages';

		try {
			// Check if git is initialized
			await runCommand('git rev-parse --is-inside-work-tree', projectPath);
		} catch {
			vscode.window.showErrorMessage('Git repository not initialized. Initialize it first.');
			return;
		}

		try {
			// Create build directory if it doesn't exist
			await runCommand(`mkdir -p ${distDir}`, projectPath);

			// Build the project (adjust build command as necessary)
			vscode.window.showInformationMessage('Building the project...');
			await runCommand('npm run build', projectPath);

			// Deploy to gh-pages
			vscode.window.showInformationMessage('Deploying to GitHub Pages...');
			await runCommand(`git add ${distDir}`, projectPath);
			await runCommand(`git commit -m "Deploy to GitHub Pages"`, projectPath);
			await runCommand(`git subtree push --prefix ${distDir} origin ${branch}`, projectPath);

			vscode.window.showInformationMessage('Deployment to GitHub Pages successful!');
		} catch (error) {
			vscode.window.showErrorMessage(`Deployment failed: ${error}`);
		}
	});

const deployWithBuild = vscode.commands.registerCommand('yutools.ghpages.deployWithBuild',
	async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;

		if (!workspaceFolders || workspaceFolders.length === 0) {
			vscode.window.showErrorMessage('No workspace folder found. Open a project and try again.');
			return;
		}

		const projectPath = workspaceFolders[0].uri.fsPath;
		const distDir = 'dist';
		const branch = 'gh-pages';

		try {
			// Build and deploy
			await vscode.commands.executeCommand('yutools.ghpages.deployQuick');
		} catch (error) {
			vscode.window.showErrorMessage(`Deployment with build failed: ${error}`);
		}
	});

// context.subscriptions.push(deployQuick);
// context.subscriptions.push(deployWithBuild);
