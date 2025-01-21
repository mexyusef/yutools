import * as vscode from 'vscode';
import axios from 'axios';
import * as fs from 'fs';
import FormData from 'form-data';
import { save_pdf_url } from '../constants';

export const savePdf = vscode.commands.registerCommand(`yutools.images.savePdf`, async () => {
	const options: vscode.OpenDialogOptions = {
		canSelectMany: false,
		openLabel: 'Open',
		filters: {
			'PDF files': ['pdf']
		}
	};

	const fileUri = await vscode.window.showOpenDialog(options);

	if (fileUri && fileUri[0]) {
		const filePath = fileUri[0].fsPath;
		const fileName = fileUri[0].path.split('/').pop();
		const fileData = fs.readFileSync(filePath);

		try {
			const form = new FormData();
			form.append('file', fs.createReadStream(filePath), fileName);

			const response = await axios.post(save_pdf_url, form, {
				headers: {
					...form.getHeaders(),
				},
			});
			vscode.window.showInformationMessage(`PDF saved successfully: ${response.data.file_path}`);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Error saving PDF: ${error.message}`);
		}
	}
});
