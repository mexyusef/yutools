import * as vscode from 'vscode';
import axios from 'axios';
import { OCR_OPENAI_URL } from '../constants';
import { getPromptAndContext, insertTextInEditor } from '../../../handlers/commands/vendor';

export const ocrOpenAI = vscode.commands.registerCommand(`yutools.images.ocrOpenAI`, async () => {
	// const userPrompt = await vscode.window.showInputBox({ prompt: 'Enter the user prompt' });
	const { prompt: userPrompt, context } = await getPromptAndContext();
	const urlsOrFilename = await vscode.window.showInputBox({ prompt: 'Enter the filename or URLs (comma separated). Leave empty for screen capture.' });

	if (userPrompt !== undefined) {
		let urlsOrFilenameValue: string | string[] | null = null;
		if (urlsOrFilename) {
			urlsOrFilenameValue = urlsOrFilename.split(',').map(item => item.trim());
			if (urlsOrFilenameValue.length === 1) {
				urlsOrFilenameValue = urlsOrFilenameValue[0];
			}
		}

		try {
			const response = await axios.post(OCR_OPENAI_URL, {
				user_prompt: userPrompt,
				urls_or_filename: urlsOrFilenameValue
			});
			// vscode.window.showInformationMessage(`OCR OpenAI Result: ${response.data.result}`);
			insertTextInEditor(response.data.result);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Error: ${error.message}`);
		}
	} else {
		vscode.window.showErrorMessage('User prompt is required.');
	}
});
