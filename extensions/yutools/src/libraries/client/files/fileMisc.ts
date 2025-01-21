import * as vscode from 'vscode';
/**
 * Determines whether a file should be tracked based on its URI.
 *
 * @param uri - The URI of the file.
 * @returns `true` if the file should be tracked; otherwise, `false`.
 */
export function shouldTrackFile(uri: vscode.Uri): boolean {
	if (!uri || !uri.scheme) return false;

	const unsupportedSchemes = ['untitled'];
	if (unsupportedSchemes.includes(uri.scheme)) return false;

	if (uri.fsPath.includes('.rustup')) return false;

	return uri.scheme === 'file';
}

/**
 * Returns the base language ID for a given language.
 *
 * @param languageId - The language ID to normalize.
 * @returns The base language ID.
 */
export function baseLanguageId(languageId: string): string {
	switch (languageId) {
		case 'typescript':
		case 'typescriptreact':
			return 'typescript';
		case 'javascript':
		case 'javascriptreact':
			return 'javascript';
		default:
			return languageId;
	}
}
