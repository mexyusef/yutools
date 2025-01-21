import * as vscode from 'vscode';
import { extension_name } from '@/constants';
import { terminalCwdMap } from './terminal_common';

function getTerminal(terminal?: vscode.Terminal): vscode.Terminal | undefined {
	return terminal || vscode.window.activeTerminal;
}

export function toggleTerminalVisibility(terminal?: vscode.Terminal) {
	const term = getTerminal(terminal);
	if (term) {
		term.dispose(); // If visible, dispose (hides it)
	} else {
		vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal'); // Opens the terminal if hidden
	}
}

export function toggleActiveTerminal() {
	const terminal = vscode.window.activeTerminal;
	if (terminal) {
		terminal.dispose(); // If the terminal is visible, dispose of it (hides it)
	} else {
		vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal'); // Opens the terminal if hidden
	}
}

export function maximizeTerminal() {
	vscode.commands.executeCommand('workbench.action.terminal.toggleMaximizedPanel'); // Maximizes terminal panel (applies globally)
}

export function restoreTerminal() {
	vscode.commands.executeCommand('workbench.action.terminal.toggleMaximizedPanel'); // Restores panel size (applies globally)
}

export function hideTerminal(terminal?: vscode.Terminal) {
	const term = getTerminal(terminal);
	if (term) {
		term.hide(); // Hides the terminal but keeps it running in the background
	}
}

export function hideActiveTerminal() {
	const terminal = vscode.window.activeTerminal;
	if (terminal) {
		vscode.commands.executeCommand('workbench.action.terminal.hidePanel'); // Hides the terminal
	}
}

export function showTerminal(terminal?: vscode.Terminal) {
	const term = getTerminal(terminal);
	if (term) {
		term.show(); // Brings the terminal into focus
	}
}

export function showActiveTerminal() {
	const terminal = vscode.window.activeTerminal;
	if (terminal) {
		vscode.commands.executeCommand('workbench.action.terminal.focus'); // Brings the terminal to focus
	} else {
		vscode.commands.executeCommand('workbench.action.terminal.new'); // If no terminal exists, create a new one
	}
}

export function createNewTerminal(
	name?: string, cwd?: string, shellPath?: string, shellArgs?: string[]
): vscode.Terminal {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	const terminal = vscode.window.createTerminal({
		name: name || "New Terminal",
		shellPath: shellPath || "cmd.exe",
		shellArgs: shellArgs || undefined,
		cwd: cwd || workspaceFolder
	});
	terminal.show();
	return terminal;
}

export function createNewTerminalAtCwd(
	name?: string, shellPath?: string, shellArgs?: string[]
): vscode.Terminal {
	const handle = vscode.workspace.getConfiguration(extension_name);
	return createNewTerminal(
		name,
		handle.get('currentWorkingDirectory'),
		shellPath,
		shellArgs
	);
}

export function openPowershellTerminal() {
	vscode.window.createTerminal({ name: "PowerShell", shellPath: 'powershell.exe' }).show();
}

export function openWindowsCmdTerminal(perintah: string | undefined = undefined, name = "CMD") {
	const terminal = vscode.window.createTerminal({ name: name, shellPath: 'cmd.exe' });
	terminal.show();
	if (perintah !== undefined) {
		terminal.sendText("dir");
	}
	return terminal;
}

export function openWindowsCmdTerminal2(
	perintah?: string,
	cwd?: string,
	shellArgs?: string[]
): vscode.Terminal {

	const nilai_cwd = cwd || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') || (
		vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : ''
	);

	const terminal = vscode.window.createTerminal({
		name: "CMD",
		shellPath: "cmd.exe",
		shellArgs: shellArgs || undefined,
		// cwd: cwd || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
		// cwd: cwd || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory'),
		cwd: nilai_cwd,
	});
	terminalCwdMap.set(terminal.name, nilai_cwd);
	terminal.show();
	if (perintah) {
		terminal.sendText(perintah);
	}
	return terminal;
}

interface TerminalOptions {
	perintah?: string;
	cwd?: string;
	shellArgs?: string[];
	name?: string;
}

export function openWindowsCmdTerminal3(options: TerminalOptions): vscode.Terminal {
	const {
		perintah,
		cwd,
		shellArgs,
		name = "CMD", // Default name is "CMD" if not provided
	} = options;
	const nilai_cwd = cwd || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') || (
		vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : ''
	);
	const terminal = vscode.window.createTerminal({
		name: name,
		shellPath: "cmd.exe",
		shellArgs: shellArgs || undefined,
		cwd: nilai_cwd,
	});

	// Store cwd in the map with terminal's name or ID as key
	terminalCwdMap.set(terminal.name, nilai_cwd);

	terminal.show();
	if (perintah) {
		terminal.sendText(perintah);
	}
	return terminal;
}

// openWindowsCmdTerminal3({
// 	perintah: "python my_script.py",
// 	cwd: "C:\\My\\Project\\Path",
// 	name: "Python Terminal",
// 	shellArgs: ["/K"],
// });
// openWindowsCmdTerminal3({ name: "My Custom Terminal" });

// await runCommandInTerminal(terminal, result_map.result, 'Project created successfully');
export function runCommandInTerminal(
	terminal: vscode.Terminal,
	command: string,
	timeoutMs: number = 60000, // 1 menit
	booleanCondition: () => boolean = () => false, // e.g. () => checkFolderAndPackageJson(myCreatedFolder)
	checkInterval: number = 500, // 0.5 detik, jika command lama spt npm install, nilai dibuat besar saja 1-3 detik
	// expectedOutput: string,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const startTime = Date.now();

		const interval = setInterval(() => {
			// Simulated completion detection (adjust this to check logs, files, or actual output)
			const elapsedTime = Date.now() - startTime;

			if (elapsedTime > timeoutMs) {
				clearInterval(interval);
				reject(new Error('Timeout waiting for terminal command to complete.'));
			}

			// Replace the condition below with real logic for detecting command completion
			// if (/* Check terminal output for `expectedOutput` */ false) {
			if (booleanCondition()) {
				clearInterval(interval);
				resolve();
			}
		}, checkInterval);

		terminal.sendText(command);
	});
}
