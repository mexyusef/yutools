import * as vscode from 'vscode';
import { executeGitCommandNewterminal } from './execute_terminal';
// {
//   "contributes": {
//     "commands": [
//       {
//         "command": "extension.gitCommandLoop",
//         "title": "Git Command Menu",
//         "category": "Explorer"
//       }
//     ],
//     "menus": {
//       "explorer/context": [
//         {
//           "command": "extension.gitCommandLoop",
//           "when": "explorerResourceIsFolder",
//           "group": "navigation"
//         }
//       ]
//     }
//   }
// }

// const gitCommands = [
// 	{ label: 'git status', description: 'Show git status' },
// 	{ label: 'git commit', description: 'Commit changes' },
// 	{ label: 'git log', description: 'Show git log' },
// 	{ label: 'git pull', description: 'Pull latest changes' },
// 	{ label: 'git fetch', description: 'Fetch changes' },
// 	{ label: 'quit', description: 'Quit menu' }
// ];

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

const gitCommandLoop = vscode.commands.registerCommand('yutools.gitCommandLoop',
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
					await executeGitCommandNewterminal(directory, selectedCommand.label);
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
		await executeGitCommandNewterminal(directory, `git commit -m "${commitMessage}"`);
	}
}

async function handleGitCheckout(directory: string) {
	// Fetch the list of branches
	const terminal = vscode.window.createTerminal({ name: 'Git Command', cwd: directory });
	terminal.sendText('git branch --list --format="%(refname:short)"');
	terminal.show();

	// Simulate a short wait for branches to populate the terminal
	await new Promise((resolve) => setTimeout(resolve, 500));

	// Ask the user to input the branch name
	const branch = await vscode.window.showInputBox({ prompt: 'Enter branch to checkout' });
	if (branch) {
		await executeGitCommandNewterminal(directory, `git checkout ${branch}`);
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
			await executeGitCommandNewterminal(directory, `git branch ${branchName}`);
		}
	} else if (selectedOption.value === 'delete') {
		// Fetch the list of branches
		const branches = await vscode.window.showQuickPick(fetchBranchList(directory), {
			placeHolder: 'Select a branch to delete'
		});

		if (branches) {
			const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
				placeHolder: `Are you sure you want to delete the branch ${branches}?`
			});
			if (confirm === 'Yes') {
				await executeGitCommandNewterminal(directory, `git branch -d ${branches}`);
			}
		}
	}
}

async function fetchBranchList(directory: string): Promise<string[]> {
	return new Promise((resolve) => {
		const terminal = vscode.window.createTerminal({ name: 'Git Command', cwd: directory });
		terminal.sendText('git branch --list --format="%(refname:short)"');
		terminal.show();

		setTimeout(() => {
			// Simulate retrieval of branch list (modify to actually parse the terminal output)
			resolve(['main', 'develop', 'feature-x']);
		}, 500);
	});
}

export function register_git_loop_command(context: vscode.ExtensionContext) {
	context.subscriptions.push(gitCommandLoop);
}
