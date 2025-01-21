import * as vscode from 'vscode';
import { main_file_templates } from '../../../constants';
import { getPromptAndContext, overrideFileWithBackup } from '../../../handlers/commands/vendor';
import { runPreviewProjectInTerminal } from './runPreviewProjectInTerminal';
import { previewProjectOnWebviewBesideOrBrowser } from './previewProjectOnWebviewBeside';

export async function swapFileRunInTerminalPreview(framework: string, open_in_browser: boolean = false) {
	try {
		// const selection = getEditorSelection();
		const { prompt: selection, context } = await getPromptAndContext();

		const filePath = main_file_templates[framework]["file"]; //getBackupFilePath();

		// const backupFilePath = await createFileBackup(filePath);
		// await swapFileContent(filePath, selection as string);
		const status = overrideFileWithBackup(filePath, selection as string);

		await runPreviewProjectInTerminal(framework);

		previewProjectOnWebviewBesideOrBrowser(framework, open_in_browser);

	} catch (error: any) {
		vscode.window.showErrorMessage(`Error: ${error.message}`);
	}
}
