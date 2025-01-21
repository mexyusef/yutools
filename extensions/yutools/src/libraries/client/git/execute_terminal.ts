import * as vscode from 'vscode';

export async function executeGitCommand(directory: string, command: string) {
	// Create and reuse a terminal without stealing focus
	const terminalName = 'gitCommandLoopBackground';
	let terminal = vscode.window.terminals.find((t) => t.name === terminalName);

	if (!terminal) {
		terminal = vscode.window.createTerminal({ name: terminalName, cwd: directory });
	}
	terminal.show();
	terminal.sendText(command);
}


export async function executeGitCommandNewterminal(directory: string, command: string) {
	const terminal = vscode.window.createTerminal({
		name: 'gitCommandLoop',
		cwd: directory,
	});

	terminal.show();
	terminal.sendText(command);
}

export async function executeGitCommandAtCurrentTerminal(directory: string, command: string) {
	const terminalName = 'gitCommandLoopBackground';

	// Check if there's an active terminal
	let terminal = vscode.window.activeTerminal;

	// If no active terminal, find or create a new one
	if (!terminal) {
			terminal = vscode.window.terminals.find((t) => t.name === terminalName);
	}

	if (!terminal) {
			// If no terminal with the desired name, create a new one
			terminal = vscode.window.createTerminal({ name: terminalName, cwd: directory });
	}

	// Focus the terminal and send the command
	terminal.show();
	terminal.sendText(command);
}