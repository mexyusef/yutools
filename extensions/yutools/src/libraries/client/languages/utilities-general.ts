import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

/**
 * Runs a command asynchronously.
 *
 * @param command - The command to execute.
 * @param args - The arguments to pass to the command.
 * @param workingDirectory - The directory where the command should run.
 * @returns A promise that resolves with the command's output.
 */
export async function runCommand(
	command: string,
	args: string[],
	workingDirectory: string
): Promise<{ stdout: string; stderr: string }> {
	return new Promise((resolve, reject) => {
		const process = spawn(command, args, { cwd: workingDirectory });
		let stdout = '';
		let stderr = '';

		process.stdout.on('data', (data) => (stdout += data.toString()));
		process.stderr.on('data', (data) => (stderr += data.toString()));

		process.on('close', (code) => {
			if (code === 0) {
				resolve({ stdout, stderr });
			} else {
				reject(new Error(`Command failed with code ${code}`));
			}
		});
	});
}

/**
 * Reads and parses a JSON file.
 *
 * @param filePath - The path to the JSON file.
 * @returns The parsed JSON object.
 */
export function readJSON(filePath: string): Record<string, unknown> {
	const content = fs.readFileSync(filePath, 'utf8');
	return JSON.parse(content);
}

/**
 * Detects the active directories in a given workspace configuration.
 *
 * @param workingDirectory - The workspace directory.
 * @param config - An array of active directories or null.
 * @returns An array of active directories.
 */
export function detectActiveDirectories(workingDirectory: string, config: string[] | null): string[] {
	if (!config || config.length === 0) return [workingDirectory];
	return config.map((dir) => path.resolve(workingDirectory, dir));
}

/**
 * Gets the selected text in a given editor context.
 *
 * @param editor - A mock editor object with a document and selection.
 * @returns The selected text or null if no selection exists.
 */
export function getSelectedText(editor: { document: { getText: (selection: any) => string }; selection: any }): string | null {
	const { selection, document } = editor;
	if (selection.start.line === selection.end.line && selection.start.character === selection.end.character) {
		return null;
	}
	return document.getText(selection);
}

// import { runCommand, readJSON, detectActiveDirectories } from './utilities-general';

// 1. Run a shell command
runCommand('ls', ['-l'], '/path/to/dir')
	.then(({ stdout }) => console.log(stdout))
	.catch(console.error);

// 2. Read a JSON file
const config = readJSON('/path/to/config.json');
console.log(config);

// 3. Detect active directories
const activeDirs = detectActiveDirectories('/workspace', ['src', 'test']);
console.log(activeDirs);
