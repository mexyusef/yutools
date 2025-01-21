import * as vscode from 'vscode';
import { shouldTrackFile } from './fileMisc';

export interface FileContents {
	uri: vscode.Uri;
	language: string;
	contents: string;
}

/**
 * Collects relevant files based on active editor tabs and their proximity.
 *
 * @returns An array of file contents.
 */
export async function getRelevantFiles(): Promise<FileContents[]> {
	const files: FileContents[] = [];
	const visibleUris = vscode.window.visibleTextEditors.flatMap((e) =>
		e.document.uri.scheme === 'file' ? [e.document.uri] : []
	);

	const allUris: vscode.Uri[] = vscode.window.tabGroups.all
		.flatMap(({ tabs }) => tabs.map((tab) => (tab.input as any)?.uri))
		.filter(Boolean);

	const uris: Map<string, vscode.Uri> = new Map();
	const surroundingTabs = visibleUris.length <= 1 ? 3 : 2;

	for (const visibleUri of visibleUris) {
		uris.set(visibleUri.toString(), visibleUri);

		const index = allUris.findIndex((uri) => uri.toString() === visibleUri.toString());
		if (index === -1) continue;

		const start = Math.max(index - surroundingTabs, 0);
		const end = Math.min(index + surroundingTabs, allUris.length - 1);

		for (let j = start; j <= end; j++) {
			uris.set(allUris[j].toString(), allUris[j]);
		}
	}

	const documents = (
		await Promise.all(
			[...uris.values()].map(async (uri) => {
				try {
					return [await vscode.workspace.openTextDocument(uri)];
				} catch {
					return [];
				}
			})
		)
	).flat();

	for (const document of documents) {
		if (document.fileName.endsWith('.git')) continue;

		if (shouldTrackFile(document.uri)) {
			const endLine = Math.min(document.lineCount, 10_000);
			const range = new vscode.Range(0, 0, endLine, 0);
			files.push({
				uri: document.uri,
				language: document.languageId,
				contents: document.getText(range),
			});
		}
	}

	return files;
}
