import { generateContextForEmbedding, getSymbolsFromDocument } from './code-analysis';

/**
 * Activates language-specific extensions by their type.
 *
 * @param languageTypes - A set of file extensions/types to activate (e.g., ts, py).
 * @returns A promise that resolves when all relevant extensions are activated.
 */
export async function activateLanguageExtensions(languageTypes: Set<string>): Promise<void> {
	// Mock implementation: Real implementation would activate extensions dynamically.
	for (const type of languageTypes) {
		console.log(`Activating language extension for type: ${type}`);
	}
}

/**
 * Detects the language type based on file extension.
 *
 * @param fileExtension - The file extension (e.g., .ts, .py).
 * @returns The detected language type as a string.
 */
export function detectLanguageType(fileExtension: string): string {
	const languageMap: Record<string, string> = {
		".ts": "TypeScript",
		".tsx": "TypeScript JSX",
		".js": "JavaScript",
		".jsx": "JavaScript JSX",
		".py": "Python",
		".go": "Go",
		".rs": "Rust",
	};
	return languageMap[fileExtension] || "Unknown";
}


// Example 1: Generate context for embeddings
const context = generateContextForEmbedding('function foo() {}', '/path/to/file.ts', 'global');
console.log(context);

// Example 2: Get symbols from a document
getSymbolsFromDocument('/path/to/file.ts', 'typescript').then((symbols) => {
	console.log('Extracted Symbols:', symbols);
});

// Example 3: Activate language extensions
activateLanguageExtensions(new Set(['.ts', '.py']));

// Example 4: Detect language type
console.log(detectLanguageType('.ts')); // Output: TypeScript
