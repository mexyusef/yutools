import * as vscode from 'vscode';
import { spawn } from 'child_process';

export const runTkinterAppFiles2Prompt = vscode.commands.registerCommand('yutools.tkinter.runTkinterAppFiles2Prompt', () => {
	// Spawn a detached process to run the Tkinter app
	const child = spawn('python', ['C:\\Users\\usef\\work\\sidoarjo\\schnell\\app\\llmutils\\files2prompt\\gui7.py'], {
		detached: true, // Detach the process so it runs independently
		stdio: 'ignore', // Ignore stdin, stdout, and stderr
		shell: true // Run in a shell (optional, but useful for Windows)
	});

	// Unreference the child process so it doesn't block the extension host
	child.unref();

	vscode.window.showInformationMessage('Tkinter app is running in the background.');
});
