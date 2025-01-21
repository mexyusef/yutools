import * as vscode from 'vscode';

export async function hasVarPlaceholder(command: string): Promise<boolean> {
	// Regex to match placeholders like __VAR1__, __VAR2__, etc.
	const varRegex = /__VAR(\d+)__/g;
	// Check if there is at least one match
	return varRegex.test(command);
}

export async function preprocessString(command: string): Promise<string | undefined> {
	// Regex to match placeholders like __VAR1__, __VAR2__, etc.
	const varRegex = /__VAR(\d+)__/g;
	const uniqueVars = new Set<string>();

	// Find all unique placeholders in the command
	let match;
	while ((match = varRegex.exec(command)) !== null) {
		uniqueVars.add(match[0]);
	}
	console.log(`

		preprocessString, input: ${command}
		uniqueVars: ${JSON.stringify(Array.from(uniqueVars))}

	`);
	// Map to store user input for each unique placeholder
	const replacements: Record<string, string> = {};

	// Iterate over the unique placeholders and prompt the user for input
	for (const uniqueVar of uniqueVars) {
		const userInput = await vscode.window.showInputBox({
			prompt: `Replace ${uniqueVar} in ${command}`,
		});
		// If the user cancels input, return undefined (no substitution)
		if (userInput === undefined) {
			return undefined;
		}
		replacements[uniqueVar] = userInput;
	}

	// Replace all placeholders in the command with the user input
	const processedCommand = command.replace(varRegex, (match) => {
		return replacements[match] || match; // Replace or leave unchanged
	});

	return processedCommand;
}

// async function sendToTerminal(command: string) {
//     const processedCommand = await preprocessString(command);
//     if (processedCommand) {
//         const terminal = vscode.window.activeTerminal;
//         if (terminal) {
//             terminal.sendText(processedCommand);
//         } else {
//             vscode.window.showErrorMessage('No active terminal found.');
//         }
//     }
// }

export async function preprocessStringPermissive(command: string): Promise<string> {
	// Regex to match placeholders like __VAR1__, __VAR2__, etc.
	const varRegex = /__VAR(\d+)__/g;
	const uniqueVars = new Set<string>();

	// Find all unique placeholders in the command
	let match;
	while ((match = varRegex.exec(command)) !== null) {
		uniqueVars.add(match[0]);
	}
	console.log(`

		preprocessStringPermissive, input: ${command}
		uniqueVars: ${JSON.stringify(Array.from(uniqueVars))}

	`);
	// Map to store user input for each unique placeholder
	const replacements: Record<string, string> = {};

	// Iterate over the unique placeholders and prompt the user for input
	for (const uniqueVar of uniqueVars) {
		const userInput = await vscode.window.showInputBox({
			prompt: `Replace ${uniqueVar} in ${command}`,
		});
		// If the user cancels input, return undefined (no substitution)
		if (userInput === undefined) {
			continue;
		}
		replacements[uniqueVar] = userInput;
	}

	// Replace all placeholders in the command with the user input
	const processedCommand = command.replace(varRegex, (match) => {
		return replacements[match] || match; // Replace or leave unchanged
	});

	return processedCommand;
}

// ini kita butuhkan karena sering kita bikin command <folder> lalu <folder> dibuat
// dan fmus lang pengen bisa bekerja dari dalam <folder>,
// jadi kita perlu cara utk menangkap variable tersebut
// utk jadi bagian dari kode fmuslang
export async function processCommandWithMap(command: string): Promise<{ result: string; map: Record<string, string> } | undefined> {
	const varRegex = /__VAR(\d+)__/g;
	const uniqueVars = new Set<string>();

	let match;
	while ((match = varRegex.exec(command)) !== null) {
		uniqueVars.add(match[0]);
	}
	console.log(`

		preprocessString, input: ${command}
		uniqueVars: ${JSON.stringify(Array.from(uniqueVars))}

	`);
	const replacements: Record<string, string> = {};

	for (const uniqueVar of uniqueVars) {
		const userInput = await vscode.window.showInputBox({
			prompt: `Enter replacement for ${uniqueVar}`,
		});

		if (userInput === undefined) {
			return undefined;
		}

		replacements[uniqueVar] = userInput;
	}

	const processedCommand = command.replace(varRegex, (match) => replacements[match] || match);

	return {
		result: processedCommand,
		map: replacements
	};
}

export function applyReplacements(command: string, map: Record<string, string>): string {
	const varRegex = /__VAR(\d+)__/g;

	return command.replace(varRegex, (match) => {
		return map[match] || match; // Replace with the map value or leave unchanged
	});
}

// async function exampleUsage() {
//     const command = 'echo __VAR1__ and __VAR2__ and __VAR1__';
//     const processed = await processCommandWithMap(command);

//     if (processed) {
//         console.log('Processed Result:', processed.result);
//         console.log('Map:', processed.map);

//         // Applying replacements on a new command using the map
//         const newCommand = applyReplacements('new command with __VAR1__', processed.map);
//         console.log('New Processed Command:', newCommand);
//     }
// }

// array of string to array of {value, label}
interface Command {
	value: string;
	label: string;
}

export function convertArrayToObjects(commands: string[]): Command[] {
	return commands.map(command => ({
		value: command,
		label: command
	}));
}
