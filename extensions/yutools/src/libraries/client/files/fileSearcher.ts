import * as fs from 'fs';
import * as path from 'path';

export type SearchOptions = {
	caseSensitive?: boolean;
	maxDepth?: number;
};

export class FileSearcher {
	/**
	 * Finds files matching a pattern within a directory.
	 *
	 * @param baseFolder The folder to start searching from.
	 * @param pattern The pattern to match file names (e.g., "*.ts").
	 * @param options Options for search customization.
	 * @returns Array of file paths that match the pattern.
	 */
	static async findFiles(
		baseFolder: string,
		pattern: string,
		options: SearchOptions = {}
	): Promise<string[]> {
		const { caseSensitive = false, maxDepth = Infinity } = options;

		const normalizedPattern = caseSensitive ? pattern : pattern.toLowerCase();
		const matches: string[] = [];

		const searchFolder = async (folder: string, depth: number) => {
			if (depth > maxDepth) return;

			const entries = await fs.promises.readdir(folder, { withFileTypes: true });
			for (const entry of entries) {
				const entryPath = path.join(folder, entry.name);

				if (entry.isDirectory()) {
					await searchFolder(entryPath, depth + 1);
				} else if (entry.isFile()) {
					const fileName = caseSensitive ? entry.name : entry.name.toLowerCase();
					if (fileName.includes(normalizedPattern)) {
						matches.push(entryPath);
					}
				}
			}
		};

		await searchFolder(baseFolder, 0);
		return matches;
	}
}
