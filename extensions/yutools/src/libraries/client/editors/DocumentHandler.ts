import * as vscode from 'vscode';
import { shouldTrackFile } from '../files/fileMisc';
import { getRelevantFiles } from '../files/RelevantFilesCollector';

export interface LLMProxyClient {
	documentOpen(filePath: string, content: string, languageId: string): Promise<void>;
}


/**
 * Handles changes to the active document.
 *
 * @param document - The active text editor.
 * @param proxyClient - The LLM proxy client for handling document events.
 */
export async function handleChangedActiveDocument(
	document: vscode.TextEditor | undefined,
	proxyClient: LLMProxyClient
): Promise<void> {
	if (!document || document.document.uri.scheme === 'codegen') return;

	if (shouldTrackFile(document.document.uri)) {
		await proxyClient.documentOpen(
			document.document.uri.fsPath,
			document.document.getText(),
			document.document.languageId
		);
	}
}

class MyLLMProxyClient implements LLMProxyClient {
	async documentOpen(filePath: string, content: string, languageId: string): Promise<void> {
		console.log(`File opened: ${filePath}, Language: ${languageId}`);
		// Implement actual proxy logic here
	}
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	const proxyClient = new MyLLMProxyClient();

	vscode.window.onDidChangeActiveTextEditor((editor) => {
		handleChangedActiveDocument(editor, proxyClient);
	});

	const files = await getRelevantFiles();
	console.log('Relevant Files:', files);
}

// // we want to send the open tabs here to the sidecar
// const openTextDocuments = await getRelevantFiles();
// openTextDocuments.forEach((openTextDocument) => {
// 	// not awaiting here so we can keep loading the extension in the background
// 	if (shouldTrackFile(openTextDocument.uri)) {
// 		sidecarClient.documentOpen(openTextDocument.uri.fsPath, openTextDocument.contents, openTextDocument.language);
// 	}
// });
