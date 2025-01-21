import * as vscode from 'vscode';

export function insert_string_at_cursor(strings: string[]) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage('No active editor');
		return;
	}

	editor.edit(editBuilder => {
		const position = editor.selection.active;
		strings.forEach((str, index) => {
			editBuilder.insert(position.with(position.line + index, 0), str + '\n');
		});
	});

}
