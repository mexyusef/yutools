import * as vscode from 'vscode';
import { cleanUpPromptFromPrefix } from './utilities/cleanUpPromptFromPrefix';

export async function callApiFunctionWithoutContext(
	endpoint: string,
	prompt: string,
	// context: string,
	endpointMapping: { [endpoint: string]: (prompt: string) => Promise<string | string[]> }
): Promise<void> {

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; // No open text editor
	}

	const document = editor.document;
	const selection = editor.selection;

	// Get the position to insert the text
	const position = selection.active;

	const apiFunction = endpointMapping[endpoint];
	if (!apiFunction) {
		vscode.window.showErrorMessage(`No API function found for endpoint: ${endpoint}`);
		return;
	}

	const cleanPrompt = cleanUpPromptFromPrefix(prompt);
	try {
		const result = await apiFunction(cleanPrompt);
		let textToInsert: string;
		if (Array.isArray(result)) {
			textToInsert = result.join('\n**********\n\n');
		} else {
			textToInsert = result;
		}

		editor.edit(editBuilder => {
			editBuilder.insert(position, `\n${textToInsert}`);
		});
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error: ${error.message}`);
	}
}
