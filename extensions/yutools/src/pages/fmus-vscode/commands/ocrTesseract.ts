import * as vscode from 'vscode';
import axios from 'axios';
import { insertTextInEditor } from '../../../handlers/commands/vendor';
import { OCR_TESSERACT_URL } from '../constants';

export const ocrTesseract = vscode.commands.registerCommand(`yutools.images.ocrTesseract`, async () => {
	try {
		const response = await axios.post(OCR_TESSERACT_URL);
		// vscode.window.showInformationMessage(`OCR Tesseract Result: ${response.data.result}`);
		insertTextInEditor(response.data.result);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Error: ${error.message}`);
	}
});
