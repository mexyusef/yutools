import * as vscode from 'vscode';
import { generalSingleQuery } from '../networkquery';
import { getPromptAndContext, insertTextInEditor, replaceKeys } from '../../../handlers/commands/vendor';
import { fmusFormatPrompt } from '../prompt';
import { getCurrentProjectFolder } from '../utilities/getCurrentProjectFolder';

export const fmusFormatCommand = vscode.commands.registerCommand(`yutools.projects.fmusFormatCommand`, async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return;
	const workfile = editor.document.uri.fsPath;
	// kita ubah generated fmus di folder sesuai setting, bukan lagi sesuai file fmus
	// C:\portfolio\fmus-lib\fmus-ts\fmus-vscode\src\fmus-prompt.txt
	// const workdir = getFolder(workfile);
	const workdir = getCurrentProjectFolder();
	const { prompt, context } = await getPromptAndContext();
	const systemPrompt = replaceKeys(
		fmusFormatPrompt,
		["__ROOT_NODE__", workdir],
		["__FILE_NODE__", workfile]
	);
	const result = await generalSingleQuery(`${systemPrompt}\n${prompt}`, "/quickQuery");
	if (result) {
		insertTextInEditor(result);
	}
});
