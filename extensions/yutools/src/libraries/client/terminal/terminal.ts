import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { openWindowsCmdTerminal3 } from '@/handlers/terminal';
import { register_terminal_context_menu } from './context_menu';

const openSplitTerminalsCommand = vscode.commands.registerCommand('yutools.openSplitTerminals',
	async () => {
		// Paths and commands for the left and right terminals
		const leftTerminalPath = 'C:\\ai\\yuagent\\extensions\\yuchat';
		const rightTerminalPath = 'C:\\ai\\yuagent\\extensions\\yutools';
		const leftCommand = 'bangun';
		const rightCommand = 'bangun';

		// Open the first terminal and execute the command
		const leftTerminal = vscode.window.createTerminal({
			name: 'Left Terminal',
			cwd: leftTerminalPath,
		});
		leftTerminal.show(); // Show the terminal
		leftTerminal.sendText(leftCommand); // Run the command

		// Open the second terminal split with the first and execute the command
		await vscode.commands.executeCommand('workbench.action.terminal.split'); // Split the terminal
		const rightTerminal = vscode.window.terminals.find(
			(t) => t.name === 'Left Terminal' // Focus on the split terminal
		);
		if (rightTerminal) {
			rightTerminal.sendText(`cd ${rightTerminalPath} && ${rightCommand}`); // Change directory and run the command
		}
	}
);

// "contributes": {
//   "configuration": {
//     "type": "object",
//     "title": "YuTools Settings",
//     "properties": {
//       "yutools.terminalConfigurations": {
//         "type": "array",
//         "description": "List of terminal configurations with folder paths and commands.",
//         "items": {
//           "type": "object",
//           "properties": {
//             "path": {
//               "type": "string",
//               "description": "The folder path for the terminal."
//             },
//             "command": {
//               "type": "string",
//               "description": "The command to execute in the terminal."
//             }
//           },
//           "required": ["path", "command"]
//         },
//         "default": []
//       }
//     }
//   }
// }

// "yutools.terminalConfigurations": [
//   {
//     "path": "C:\\ai\\yuagent\\extensions\\yuchat",
//     "command": "npm run compile"
//   },
//   {
//     "path": "C:\\ai\\yuagent\\extensions\\yutools",
//     "command": "npm run compile"
//   },
//   {
//     "path": "C:\\another\\project",
//     "command": "npm start"
//   }
// ]

const openDynamicTerminalsCommand = vscode.commands.registerCommand('yutools.openDynamicTerminals',
	async () => {
		// Fetch terminal configurations from settings
		const terminalConfigurations: Array<{ path: string; command: string }> =
			vscode.workspace.getConfiguration('yutools').get('terminalConfigurations') || [];

		if (terminalConfigurations.length === 0) {
			vscode.window.showWarningMessage('No terminal configurations found in settings.');
			return;
		}

		let firstTerminal: vscode.Terminal | undefined;

		for (const [index, config] of terminalConfigurations.entries()) {
			// Validate path and command
			if (!config.path || !config.command) {
				vscode.window.showErrorMessage(
					`Invalid configuration at index ${index}. Both path and command are required.`
				);
				continue;
			}

			// Create or split terminal
			let terminal: vscode.Terminal;
			if (index === 0) {
				// Create the first terminal
				terminal = vscode.window.createTerminal({
					name: `Terminal ${index + 1}`,
					cwd: config.path,
				});
				firstTerminal = terminal;
			} else {
				// Split terminal
				await vscode.commands.executeCommand('workbench.action.terminal.split');
				terminal = vscode.window.terminals[vscode.window.terminals.length - 1];
			}

			// Execute the command
			terminal.show(false); // Show terminal without focus
			terminal.sendText(config.command);
		}

		// Focus on the first terminal if available
		firstTerminal?.show(true);
	}
);

// export function register_misc_terminal_commands(context: vscode.ExtensionContext) {
// 	// Command: Open Terminal in File Directory
// 	const openTerminalInFileDirectory = vscode.commands.registerCommand(
// 		"yutools.openTerminalInFileDirectory",
// 		async () => {
// 			const activeEditor = vscode.window.activeTextEditor;
// 			if (!activeEditor) {
// 				vscode.window.showErrorMessage("No active editor found.");
// 				return;
// 			}

// 			const fileUri = activeEditor.document.uri;
// 			if (fileUri.scheme !== "file") {
// 				vscode.window.showErrorMessage("The active file is not a physical file.");
// 				return;
// 			}

// 			const filePath = fileUri.fsPath;
// 			const parentDirectory = path.dirname(filePath);

// 			const terminal = vscode.window.createTerminal({
// 				cwd: parentDirectory,
// 				name: `Terminal - ${path.basename(parentDirectory)}`
// 			});

// 			terminal.show();
// 		}
// 	);

// 	// Register the command
// 	context.subscriptions.push(openTerminalInFileDirectory);
// }

const copyTerminalOutput = vscode.commands.registerCommand("yutools.copyTerminalOutput",
	async () => {
		// const terminal = vscode.window.activeTerminal;
		// if (!terminal) {
		//   vscode.window.showErrorMessage("No active terminal found.");
		//   return;
		// }

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No active editor found.");
			return;
		}

		// Define a temporary file path for storing terminal output
		const tempFilePath = path.join(require("os").tmpdir(), "terminal_output.txt");

		// Command to capture terminal output to a file (PowerShell example)
		// const captureCommand = `Get-Content * | Out-File -FilePath "${tempFilePath}"`;
		const captureCommand = `npm run compile | Out-File -FilePath "${tempFilePath}" -Encoding UTF8`;

		// const terminal = vscode.window.createTerminal("Temporary Terminal");
		const terminal = openWindowsCmdTerminal3({ name: "Temporary Terminal", perintah: captureCommand });
		// Send the capture command to the terminal
		// terminal.sendText(captureCommand);
		terminal.sendText(""); // Add an Enter keypress to execute the command

		// Wait for the file to be created and read its content
		setTimeout(() => {
			if (fs.existsSync(tempFilePath)) {
				const output = fs.readFileSync(tempFilePath, "utf-8");

				// Insert the output into the active editor
				editor.edit((editBuilder) => {
					editBuilder.insert(editor.selection.active, output);
				});

				vscode.window.showInformationMessage("Terminal output copied to editor.");
			} else {
				vscode.window.showErrorMessage("Failed to capture terminal output.");
			}
		}, 2000); // Adjust the delay based on the complexity of your terminal output
	}
);

const executeCustomCommand = vscode.commands.registerCommand("yutools.executeCustomCommand",
	async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No active editor found.");
			return;
		}
		// Ask the user for the command to execute
		const userCommand = await vscode.window.showInputBox({
			prompt: "Enter the command to execute",
			placeHolder: "e.g., npm run build",
		});
		if (!userCommand) {
			vscode.window.showErrorMessage("No command provided.");
			return;
		}
		const tempFilePath = path.join(os.tmpdir(), "custom_command_output.txt");
		// Create a new terminal
		const terminal = vscode.window.createTerminal("Custom Command Terminal");
		// Redirect the user's command output to a file using PowerShell
		const captureCommand = `${userCommand} | Out-File -FilePath "${tempFilePath}" -Encoding UTF8`;
		// Send the capture command to the terminal
		terminal.show();
		terminal.sendText(captureCommand);
		terminal.sendText("exit"); // Close the terminal after execution
		// Wait for the file to be created and read its content
		setTimeout(() => {
			if (fs.existsSync(tempFilePath)) {
				const output = fs.readFileSync(tempFilePath, "utf-8");
				// Insert the output into the active editor
				editor.edit((editBuilder) => {
					editBuilder.insert(editor.selection.active, output);
				});
				vscode.window.showInformationMessage(
					`Output of "${userCommand}" copied to the editor.`
				);
			} else {
				vscode.window.showErrorMessage("Failed to capture command output.");
			}
		}, 5000); // Adjust delay based on command execution time
	}
);

export function register_open_split_terminals(context: vscode.ExtensionContext) {
	context.subscriptions.push(openSplitTerminalsCommand);
}

export function register_open_dynamic_terminals(context: vscode.ExtensionContext) {
	context.subscriptions.push(openDynamicTerminalsCommand);
}

export function register_terminal_output_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(copyTerminalOutput);
}

const killAllTerminalsCommand = vscode.commands.registerCommand('yutools.killAllTerminals', () => {
	vscode.window.terminals.forEach(terminal => terminal.dispose());
	vscode.window.showInformationMessage('All terminals have been killed.');
});

const selectAndActivateTerminalCommand = vscode.commands.registerCommand('yutools.selectAndActivateTerminal', async () => {
	const terminals = vscode.window.terminals;

	if (terminals.length === 0) {
		vscode.window.showInformationMessage('No active terminals to select.');
		return;
	}

	const terminalNames = terminals.map((terminal, index) => `${index + 1}: ${terminal.name}`);
	const selectedName = await vscode.window.showQuickPick(terminalNames, {
		placeHolder: 'Select a terminal to activate',
	});

	if (selectedName) {
		const selectedIndex = parseInt(selectedName.split(':')[0]) - 1;
		terminals[selectedIndex].show();
	} else {
		// User cancelled or pressed escape
		vscode.commands.executeCommand('workbench.action.terminal.toggleTerminal');
	}
});

export function register_terminal_utilities_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(killAllTerminalsCommand);
	context.subscriptions.push(selectAndActivateTerminalCommand);
	register_terminal_context_menu(context);
}
