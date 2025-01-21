import * as path from 'path';

export function is_text_file_old(filePath: string): boolean {
	const textFileExtensions = [
		'.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.py', '.java', '.rs', '.go', '.c', '.cpp', '.cs', '.php', '.jsx', '.tsx',
	];
	return textFileExtensions.includes(path.extname(filePath));
}

export function is_text_file(filePath: string): boolean {
	const textFileExtensions = new Set([
		'.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.py', '.java', '.rs', '.go', '.c', '.cpp', '.cs', '.php', '.jsx', '.tsx',
	]);
	const extension = path.extname(filePath).toLowerCase();
	return textFileExtensions.has(extension);
}
