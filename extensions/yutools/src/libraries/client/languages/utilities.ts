import * as fs from 'fs';
import * as path from 'path';
import { exec, spawn } from 'child_process';

/**
 * Executes a command in the shell asynchronously.
 *
 * @param command - The shell command to execute.
 * @param workingDirectory - The directory where the command should run.
 * @returns The output of the command.
 */
export async function execCommand(command: string, workingDirectory: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
			if (error) {
				reject(`Command failed: ${error.message}`);
				return;
			}
			if (stderr) {
				reject(`Error in command: ${stderr}`);
				return;
			}
			resolve(stdout.trim());
		});
	});
}

/**
 * Reads a JSON file and parses its content.
 *
 * @param filePath - The path to the JSON file.
 * @returns The parsed JSON object.
 */
export function readJSONFile(filePath: string): Record<string, unknown> {
	const data = fs.readFileSync(filePath, 'utf8');
	return JSON.parse(data);
}

/**
 * Detects all file extensions in a given directory.
 *
 * @param directory - The directory path to analyze.
 * @returns A set of unique file extensions.
 */
export function detectFileExtensions(directory: string): Set<string> {
	const extensions = new Set<string>();

	function traverseDir(currentPath: string) {
		const files = fs.readdirSync(currentPath);
		files.forEach((file) => {
			const fullPath = path.join(currentPath, file);
			const stat = fs.statSync(fullPath);
			if (stat.isDirectory()) {
				traverseDir(fullPath);
			} else {
				const ext = path.extname(file);
				if (ext) {
					extensions.add(ext);
				}
			}
		});
	}

	traverseDir(directory);
	return extensions;
}

/**
 * Runs a command asynchronously and streams its output.
 *
 * @param cmd - The command to run.
 * @param args - The arguments for the command.
 * @param workingDirectory - The directory to run the command in.
 * @returns A promise that resolves when the command finishes.
 */
export async function runCommandStream(
	cmd: string,
	args: string[],
	workingDirectory: string
): Promise<void> {
	return new Promise((resolve, reject) => {
		const process = spawn(cmd, args, { cwd: workingDirectory });
		process.stdout.on('data', (data) => {
			console.log(`STDOUT: ${data}`);
		});
		process.stderr.on('data', (data) => {
			console.error(`STDERR: ${data}`);
		});
		process.on('close', (code) => {
			if (code !== 0) {
				reject(new Error(`Command exited with code ${code}`));
			} else {
				resolve();
			}
		});
	});
}

// import { execCommand, readJSONFile, detectFileExtensions, runCommandStream } from './utilities';

// 1. Execute a shell command
execCommand('ls', '/path/to/directory').then(console.log).catch(console.error);

// 2. Read a JSON file
const config = readJSONFile('/path/to/config.json');
console.log(config);

// 3. Detect file extensions
const extensions = detectFileExtensions('/path/to/project');
console.log('Extensions found:', Array.from(extensions));

// 4. Stream command output
runCommandStream('npm', ['install'], '/path/to/project')
	.then(() => console.log('Command completed!'))
	.catch(console.error);
