import * as vscode from 'vscode';
import * as path from 'path';
import { DEFAULT_MARKDOWN_FILE_PATH, extension_name } from '../constants';


export async function openMarkdownFile(filename: string = DEFAULT_MARKDOWN_FILE_PATH) {
	const filePath = path.normalize(filename); // Normalize the path
	try {
		// Open the Markdown file
		const doc = await vscode.workspace.openTextDocument(filePath);
		// Show the document in a new editor
		await vscode.window.showTextDocument(doc);
		// vscode.window.showInformationMessage(`Opened: ${filePath}`);
	} catch (err) {
		// Handle error
		vscode.window.showErrorMessage(`Failed to open file: ${(err as Error).message}`);
	}
}
