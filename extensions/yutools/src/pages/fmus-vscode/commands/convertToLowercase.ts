import * as vscode from 'vscode';
import { getPromptAndContext, insertTextInEditor, stringToLowerCase } from '../../../handlers/commands/vendor';

export const convertToLowercase = vscode.commands.registerCommand(`yutools.convertToLowercase`, async () => {
	// vscode.commands.executeCommand('vscode.open', vscode.Uri.file(imgPath));
	const { prompt, context } = await getPromptAndContext();
	insertTextInEditor(
		stringToLowerCase(prompt as string)
	);
});
