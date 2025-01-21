import * as vscode from 'vscode';
import { executeGitCommand } from './execute_terminal';

const gitCommands = [
	{ label: 'git status', description: 'Show the working tree status' },
	{ label: 'git add .', description: 'Stage all changes for commit' },
	{ label: 'git commit', description: 'Commit changes with a message' },
	{ label: 'git log', description: 'View commit log history' },
	{ label: 'git pull', description: 'Pull the latest changes from remote' },
	{ label: 'git fetch', description: 'Fetch updates from the remote repository' },
	{ label: 'git push', description: 'Push committed changes to remote' },
	{ label: 'git diff', description: 'git diff' },
	{ label: 'git checkout', description: 'Switch branches or restore files' },
	{ label: 'git branch', description: 'Manage branches (list, create, delete)' },
	{ label: 'quit', description: 'Exit the menu' }
];

const gitCommandLoop = vscode.commands.registerCommand(
	'yutools.gitCommandLoopBackground',
	async (uri: vscode.Uri) => {
		const directory = uri.fsPath;

		while (true) {
			const selectedCommand = await vscode.window.showQuickPick(
				gitCommands,
				{ placeHolder: 'Select a git command to execute' }
			);

			if (!selectedCommand || selectedCommand.label === 'quit') {
				break; // Exit the loop if quit or canceled
			}

			switch (selectedCommand.label) {
				case 'git commit':
					await handleGitCommit(directory);
					break;
				case 'git checkout':
					await handleGitCheckout(directory);
					break;
				case 'git branch':
					await handleGitBranch(directory);
					break;
				default:
					await executeGitCommand(directory, selectedCommand.label);
					break;
			}
		}
	}
);



async function handleGitCommit(directory: string) {
	const defaultMessage = 'Default commit message';
	const commitMessage = await vscode.window.showInputBox({
		prompt: 'Enter commit message',
		value: defaultMessage,
		placeHolder: 'Type your commit message',
	});

	if (commitMessage) {
		await executeGitCommand(directory, `git commit -m "${commitMessage}"`);
	}
}

async function handleGitCheckout(directory: string) {
	const branches = await fetchBranchList(directory);
	const branch = await vscode.window.showQuickPick(branches, {
		placeHolder: 'Select a branch to checkout',
	});

	if (branch) {
		await executeGitCommand(directory, `git checkout ${branch}`);
	}
}

async function handleGitBranch(directory: string) {
	const branchOptions = [
		{ label: 'Create a new branch', value: 'create' },
		{ label: 'Delete an existing branch', value: 'delete' }
	];

	const selectedOption = await vscode.window.showQuickPick(branchOptions, {
		placeHolder: 'Select a branch operation'
	});

	if (!selectedOption) {
		return; // Return if user cancels the QuickPick
	}

	if (selectedOption.value === 'create') {
		const branchName = await vscode.window.showInputBox({
			prompt: 'Enter the name of the new branch'
		});
		if (branchName) {
			await executeGitCommand(directory, `git branch ${branchName}`);
		}
	} else if (selectedOption.value === 'delete') {
		const branches = await fetchBranchList(directory);
		const branchToDelete = await vscode.window.showQuickPick(branches, {
			placeHolder: 'Select a branch to delete'
		});

		if (branchToDelete) {
			const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
				placeHolder: `Are you sure you want to delete the branch ${branchToDelete}?`
			});
			if (confirm === 'Yes') {
				await executeGitCommand(directory, `git branch -d ${branchToDelete}`);
			}
		}
	}
}

async function fetchBranchList(directory: string): Promise<string[]> {
	// Simulate fetching a list of branches (replace with actual parsing of git output)
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(['main', 'develop', 'feature-x']);
		}, 500);
	});
}

export function register_git_loop_command_background(context: vscode.ExtensionContext) {
	context.subscriptions.push(gitCommandLoop);
}
