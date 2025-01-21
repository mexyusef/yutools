import * as vscode from 'vscode';
import axios from 'axios';
import { getPromptAndContext, insertTextInEditor } from '../../../handlers/commands/vendor';
import { API_BASE_URL } from '../../../constants';
import { getCurrentProjectFolder } from '../utilities/getCurrentProjectFolder';

export const createProject = vscode.commands.registerCommand(`yutools.projects.createProject`, async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return "";
	}
	// const projectPrompt = await vscode.window.showInputBox({ placeHolder: 'Enter project prompt' });
	// if (!projectPrompt) {
	// 	vscode.window.showErrorMessage('Project prompt is required');
	// 	return;
	// }
	// fmus: const { prompt: question, context } = await getPromptAndContext();
	const { prompt: projectPrompt, context } = await getPromptAndContext();
	// const workdir = await vscode.window.showInputBox({ placeHolder: 'Enter workdir (optional)' });
	// let workdir = getFolder(editor.document.uri.fsPath);
	// if (workdir === ".") {
	// 	workdir = path.normalize(path.resolve(process.cwd()));
	// }
	let workdir = getCurrentProjectFolder();
	// const llm = await vscode.window.showInputBox({ placeHolder: 'Enter LLM (optional)' });
	// const recursionLimitStr = await vscode.window.showInputBox({ placeHolder: 'Enter recursion limit (optional)', value: '50' });
	// let recursionLimit = 50;
	// if (recursionLimitStr) {
	// 	recursionLimit = parseInt(recursionLimitStr, 10);
	// 	if (isNaN(recursionLimit)) {
	// 		vscode.window.showErrorMessage('Recursion limit must be a number');
	// 		return;
	// 	}
	// }
	const data = {
		project_prompt: projectPrompt,
		workdir,
		// llm,
		// recursion_limit: recursionLimit
	};
	try {
		const response = await axios.post(`${API_BASE_URL}/create-project`, data);
		// vscode.window.showInformationMessage(response.data.response);
		insertTextInEditor(response.data.response);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to start project creation: ${error}`);
	}
});
