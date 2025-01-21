import * as fs from 'fs';
import * as path from 'path';

/**
 * Filters out excluded extensions based on a predefined list.
 *
 * @param extension - The file extension to check.
 * @returns Whether the extension is excluded.
 */
export function isExcludedExtension(extension: string): boolean {
	const excludedExtensions = [
		'.png', '.jpg', '.jpeg', '.ico', '.bmp', '.pdf', '.mp3', '.mp4', '.exe',
	];
	return excludedExtensions.includes(extension);
}

/**
 * Reads a custom system instruction from a file or returns null.
 *
 * @param filePath - Path to the file containing the system instruction.
 * @returns The instruction as a string or null if not found.
 */
export function readSystemInstruction(filePath: string): string | null {
	if (!fs.existsSync(filePath)) {
		return null;
	}
	return fs.readFileSync(filePath, 'utf8');
}

/**
 * Copies settings and configurations from one directory to another.
 *
 * @param srcDir - The source directory.
 * @param destDir - The destination directory.
 */
export function copySettings(srcDir: string, destDir: string): void {
	const settingsFiles = ['settings.json', 'keybindings.json'];
	settingsFiles.forEach((file) => {
		const srcPath = path.join(srcDir, file);
		const destPath = path.join(destDir, file);
		if (fs.existsSync(srcPath)) {
			fs.mkdirSync(path.dirname(destPath), { recursive: true });
			fs.copyFileSync(srcPath, destPath);
		}
	});
}

// import { isExcludedExtension, readSystemInstruction, copySettings } from './utilities-system';

// 1. Check if an extension is excluded
console.log(isExcludedExtension('.png')); // true

// 2. Read a system instruction
const instruction = readSystemInstruction('/path/to/instruction.txt');
console.log(instruction);

// 3. Copy configuration files
copySettings('/path/to/source', '/path/to/destination');
console.log('Settings copied!');
