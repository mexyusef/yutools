import * as vscode from 'vscode';
import axios from 'axios';
import { API_BASE_URL } from '../../../constants';
import { getPromptAndContext } from '../../../handlers/commands/vendor';

async function changeVisionSystemPrompt(systemPrompt: string) {
	try {
		await axios.post(`${API_BASE_URL}/change_vision_system_prompt`, { system_prompt: systemPrompt });
		vscode.window.showInformationMessage(`New system prompt: ${systemPrompt}`);
	} catch (error) {
		vscode.window.showErrorMessage('Failed to change vision system prompt backend.');
	}
}

export const changeVisionSystemPromptCommand = vscode.commands.registerCommand(`yutools.images.changeVisionSystemPrompt`, async () => {
	const { prompt: systemPrompt, context } = await getPromptAndContext();
	if (systemPrompt) {
		// console.log(`FMUS choice: ${selectedFile}`);
		await changeVisionSystemPrompt(systemPrompt);
	}
});
