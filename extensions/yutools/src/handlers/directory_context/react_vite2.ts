import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { getBasename } from '../file_dir';
import { applyReplacements, processCommandWithMap } from '../stringutils';
import { createNewTerminal } from '../terminal';
import { run_fmus_at_specific_dir as runFmusAtSpecificDir } from '../fmus_ketik';


const command_v3 = `npm -y create vite@latest __VAR1__ -- --template react-ts`;
const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	DIR_PROYEK,d
		src,d
		run.bat,f(n=npm run dev)
		buat.bat,f(n=npm run build)
`;

export function register_dir_context_react_vite_create2(context: vscode.ExtensionContext) {
	const extensionName = 'yutools';

	let disposable = vscode.commands.registerCommand(
		`${extensionName}.dir_context_react_vite_create2`,
		async (uri: vscode.Uri) => {
			const filePath = uri.fsPath;

			const result_map = await processCommandWithMap(command_v3);
			const terminal = createNewTerminal('React Vite Setup', filePath);
			// const installCommand = `cd ${filePath} && npm install`;
			if (result_map === undefined) {
				vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
				return;
			}
			try {
				// Run the first command and wait for completion
				await runCommandInTerminal(terminal, result_map.result, 'Project created successfully');
				const installCommand = applyReplacements(`cd __VAR1__ && npm i`, result_map.map);
				await runCommandInTerminal(terminal, installCommand, 'added 100 packages');
				const fmus_command_replaced = applyReplacements(fmus_command, result_map.map);
				runFmusAtSpecificDir(fmus_command_replaced, filePath);
			} catch (error: any) {
				vscode.window.showErrorMessage(`Error: ${error.message}`);
			}
		}
	);

	context.subscriptions.push(disposable);
}

// function createNewTerminal(
//   name?: string,
//   cwd?: string,
//   shellPath?: string,
//   shellArgs?: string[]
// ): vscode.Terminal {
//   const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
//   const terminal = vscode.window.createTerminal({
//     name: name || 'New Terminal',
//     shellPath: shellPath || 'cmd.exe',
//     shellArgs: shellArgs || undefined,
//     cwd: cwd || workspaceFolder,
//   });
//   terminal.show();
//   return terminal;
// }

function runCommandInTerminal(
	terminal: vscode.Terminal,
	command: string,
	expectedOutput: string,
	timeoutMs: number = 60000
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
			if (/* Check terminal output for `expectedOutput` */ false) {
				clearInterval(interval);
				resolve();
			}
		}, 500);

		terminal.sendText(command);
	});
}


// function waitForCommandCompletion(
// 	terminal: vscode.Terminal,
// 	expectedOutput: string,
// 	timeoutMs: number = 60000
// ): Promise<void> {
// 	return new Promise((resolve, reject) => {
// 		const startTime = Date.now();

// 		const interval = setInterval(() => {
// 			// Replace with a mechanism to monitor terminal output
// 			// This part depends on whether you can capture terminal logs
// 			// For now, we simulate checking an external signal for completion
// 			const elapsedTime = Date.now() - startTime;
// 			if (elapsedTime > timeoutMs) {
// 				clearInterval(interval);
// 				reject(new Error('Timeout waiting for terminal command to complete.'));
// 			}

// 			// Simulated completion condition (replace this with real logic)
// 			if (/* Check for expectedOutput in terminal logs */ false) {
// 				clearInterval(interval);
// 				resolve();
// 			}
// 		}, 500);
// 	});
// }

// async function registerDirContextReactViteCreate(): Promise<void> {
// 	const terminalName = 'React Vite Setup';
// 	const filePath = '/path/to/project'; // Replace with your actual project path


// 	const resultMap = await processCommandWithMap(command_v3);
// 	if (resultMap === undefined) {
// 		vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
// 		return;
// 	}

// 	const commands = [
// 		resultMap.result, // 'npm create vite@latest ...'
// 		applyReplacements('cd __VAR1__ && npm i', resultMap.map), // Replace '__VAR1__' dynamically
// 	];

// 	const terminal = createNewTerminal(terminalName, filePath);

// 	try {
// 		// Run the first command
// 		terminal.sendText(commands[0]);
// 		await waitForCommandCompletion(terminal, 'Project created successfully'); // Adjust based on expected output

// 		// Run the second command
// 		terminal.sendText(commands[1]);
// 		await waitForCommandCompletion(terminal, 'added 100 packages'); // Adjust based on expected output

// 		// Now run the next step
// 		run_fmus_at_specific_dir(fmusCommandReplaced, filePath); // Replace with your function and variables
// 	} catch (err) {
// 		console.error('Error executing terminal commands:', err);
// 	}
// }

// // Example usage (call this in your program)
// registerDirContextReactViteCreate();
