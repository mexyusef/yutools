import * as vscode from 'vscode';
import axios from 'axios';
import { API_BASE_URL } from '../../../constants';

export const captureScreenshot = vscode.commands.registerCommand(`yutools.images.captureScreenshot`, async () => {
	try {
		const response = await axios.post(`${API_BASE_URL}/capture_screenshot`, {
			output_file: null,
			datadir: null,
			delay: 1.0
		});
		// vscode.window.showInformationMessage(`Clipboard now contains ${response.output_file} data`);
		vscode.window.showInformationMessage(`Clipboard now contains ${JSON.stringify(response)}`);
	} catch (error: any) {
		vscode.window.showErrorMessage(`Failed to capture screenshot: ${error.message}`);
	}
});
