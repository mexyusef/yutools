import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import * as vscode from 'vscode';

/**
 * Executes a command asynchronously and returns stdout, stderr, and exit code.
 *
 * @param workingDirectory - The directory to execute the command in.
 * @param cmd - The command to execute.
 * @param args - Command arguments.
 * @returns Promise resolving to command output details.
 */
export async function runCommandAsync(
	workingDirectory: string,
	cmd: string,
	args: string[] = []
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
	return new Promise((resolve, reject) => {
		let stdout = '';
		let stderr = '';

		const child = spawn(cmd, args, { cwd: workingDirectory });

		child.stdout.on('data', (data) => (stdout += data));
		child.stderr.on('data', (data) => (stderr += data));

		child.on('close', (code) => {
			if (code !== 0) {
				reject(new Error(`Command exited with code ${code}: ${stderr}`));
			} else {
				resolve({ stdout, stderr, exitCode: code });
			}
		});

		child.on('error', reject);
	});
}

/**
 * Executes a shell command using `exec`.
 *
 * @param command - The command string to execute.
 * @param workingDirectory - The directory to execute the command in.
 * @returns Promise resolving to stdout as a string.
 */
export async function execCommand(command: string, workingDirectory: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
			if (error || stderr) {
				reject(error || new Error(stderr));
			} else {
				resolve(stdout.trim());
			}
		});
	});
}

/**
 * Checks whether the given file path exists and is accessible.
 *
 * @param filePath - The file path to check.
 * @returns A boolean indicating if the file exists.
 */
async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

/**
 * Finds the path of an executable bundled in specific directories.
 *
 * @param rootDir - The root directory to resolve paths from.
 * @param executableName - The name of the executable to find.
 * @param candidateDirs - List of directories to search for the executable.
 * @returns The full path to the executable if found, or null.
 */
export async function findExecutable(
	rootDir: string,
	executableName: string,
	candidateDirs: string[]
): Promise<string | null> {
	for (const dir of candidateDirs) {
		const executablePath = path.resolve(rootDir, dir, executableName);
		if (await fileExists(executablePath)) {
			return executablePath;
		}
	}
	return null;
}

// import { findExecutable } from './findExecutable';

/**
 * Gets the RipGrep executable path bundled with VSCode.
 *
 * @returns The path to the RipGrep executable, or null if not found.
 */
export async function getRipGrepPath(): Promise<string | null> {
	const rgExecutableName = process.platform === 'win32' ? 'rg.exe' : 'rg';
	const candidateDirs = [
		'node_modules/@vscode/ripgrep/bin',
		'node_modules.asar.unpacked/@vscode/ripgrep/bin',
	];

	const ripgrepPath = await findExecutable(vscode.env.appRoot, rgExecutableName, candidateDirs);
	if (!ripgrepPath) {
		console.warn('RipGrep executable not found');
	}
	return ripgrepPath;
}

export async function useRipGrep() {
	const ripgrepPath = await getRipGrepPath();

	if (ripgrepPath) {
		console.log(`RipGrep found at: ${ripgrepPath}`);
	} else {
		console.error('RipGrep executable not found');
	}
}
// useRipGrep();

export async function findCustomBinary() {
	const binaryPath = await findExecutable(
		'/some/root/dir',
		'customBinary',
		['dir1', 'dir2/unpacked']
	);

	if (binaryPath) {
		console.log(`Executable found at: ${binaryPath}`);
	} else {
		console.error('Executable not found');
	}
}
// findCustomBinary();
