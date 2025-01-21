import * as vscode from 'vscode';
import { spawn } from 'child_process';

export const runTkinterAppFirefoxer = vscode.commands.registerCommand('yutools.tkinter.runTkinterAppFirefoxer', () => {
	// Spawn a detached process to run the Tkinter app
	const child = spawn('python', ['c:\\work\\bin\\f2.py'], {
		detached: true, // Detach the process so it runs independently
		stdio: 'ignore', // Ignore stdin, stdout, and stderr
		shell: true // Run in a shell (optional, but useful for Windows)
	});

	// Unreference the child process so it doesn't block the extension host
	child.unref();

	vscode.window.showInformationMessage('Tkinter app is running in the background.');
});
