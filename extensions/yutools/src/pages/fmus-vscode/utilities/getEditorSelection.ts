import * as vscode from 'vscode';

export function getEditorSelection() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		throw new Error('No active editor found');
	}
	return editor.document.getText(editor.selection);
}
