/**
 * Provides utilities for extracting symbols from documents and generating embeddings or context.
 */

export interface SymbolInformation {
	name: string;
	kind: string;
	location: {
		uri: string;
		range: {
			start: { line: number; character: number };
			end: { line: number; character: number };
		};
	};
}

/**
 * Generates context for a given code snippet to be used in embeddings or for analysis.
 *
 * @param codeSnippet - The snippet of code.
 * @param filePath - Path of the file where the snippet exists.
 * @param scopePart - Optional scope information for the snippet.
 * @returns A structured string representing the context.
 */
export function generateContextForEmbedding(
	codeSnippet: string,
	filePath: string,
	scopePart: string | null
): string {
	return `Code snippet:\n${codeSnippet}\n\nFile path it belongs to:\n${filePath}\n\nScope part:\n${scopePart}`;
}

/**
 * Extracts symbols from a document using Language Server Protocol (LSP).
 *
 * @param filePath - The file path to analyze.
 * @param languageId - The language ID (e.g., 'typescript', 'javascript').
 * @returns A promise that resolves to a list of extracted symbol information.
 */
export async function getSymbolsFromDocument(
	filePath: string,
	languageId: string
): Promise<SymbolInformation[]> {
	// Mock implementation: In real usage, this should connect to LSP.
	// This serves as a placeholder to demonstrate API design.
	return Promise.resolve([
		{
			name: "exampleFunction",
			kind: "Function",
			location: {
				uri: filePath,
				range: {
					start: { line: 10, character: 0 },
					end: { line: 20, character: 1 },
				},
			},
		},
	]);
}

/**
 * Formats a file path into a standard structure for code location.
 *
 * @param directoryPath - The root directory path.
 * @param filePath - The file path to format.
 * @returns The formatted code location path.
 */
export function formatCodeLocation(directoryPath: string, filePath: string): string {
	const relativePath = filePath.replace(directoryPath, "").replace(/\\|\//g, ".");
	return relativePath.startsWith(".") ? relativePath.slice(1) : relativePath;
}

/**
 * Converts VSCode SymbolKind to a string-based representation.
 *
 * @param symbolKind - The numeric symbol kind (as per LSP).
 * @returns A human-readable symbol kind.
 */
export function convertSymbolKind(symbolKind: number): string {
	const symbolKindMap: Record<number, string> = {
		1: "File",
		2: "Module",
		3: "Namespace",
		4: "Package",
		5: "Class",
		6: "Method",
		7: "Property",
		8: "Field",
		9: "Constructor",
		10: "Enum",
		11: "Interface",
		12: "Function",
		13: "Variable",
		14: "Constant",
		15: "String",
		16: "Number",
		17: "Boolean",
		18: "Array",
	};
	return symbolKindMap[symbolKind] || "Unknown";
}
