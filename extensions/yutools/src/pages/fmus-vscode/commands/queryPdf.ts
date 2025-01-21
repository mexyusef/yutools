import * as vscode from 'vscode';
import axios from 'axios';
import { query_pdf_url } from '../constants';
import { getPromptAndContext, insertTextInEditor } from '../../../handlers/commands/vendor';

export const queryPdf = vscode.commands.registerCommand(`yutools.images.queryPdf`, async () => {
	const filePath = await vscode.window.showInputBox({ prompt: 'Enter the file path of the saved PDF' });
	// const question = await vscode.window.showInputBox({ prompt: 'Enter your question' });
	const { prompt: question, context } = await getPromptAndContext();

	if (filePath && question) {
		try {
			// console.log(`initial: ${question} for ${filePath} at ${query_pdf_url}`);
			const response = await axios.post(query_pdf_url, {
				file_path: filePath,
				question: question,
			});

			const resultData = response.data;

			// vscode.window.showInformationMessage(`Answer: ${resultData.answer}`);
			insertTextInEditor(resultData.answer);

			resultData.context_details.forEach((detail: any) => {
				// vscode.window.showInformationMessage(`Context ${detail.index}: ${detail.page_content}`);
				insertTextInEditor(`Context ${detail.index}: ${detail.page_content}`);
			});

		} catch (error: any) {
			vscode.window.showErrorMessage(`Error querying PDF: ${error.message}`);
		}
	}
});
