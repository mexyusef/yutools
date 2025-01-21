// "contributes": {
//   "commands": [
//     {
//       "command": "yutools.openMarkdownPreview",
//       "title": "Open Markdown Preview"
//     }
//   ],
//   "menus": {
//     "editor/context": [
//       {
//         "command": "yutools.openMarkdownPreview",
//         "when": "resourceLangId == markdown"
//       }
//     ]
//   }
// }
// "when": "resourceLangId == markdown && !editorTextFocus"

import * as vscode from 'vscode';

const openMarkdownPreviewCommand = vscode.commands.registerCommand(
	'yutools.openMarkdownPreview',
	async () => {
		// Get the active editor
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('No active editor found.');
			return;
		}

		// Ensure the active document is Markdown
		if (editor.document.languageId !== 'markdown') {
			vscode.window.showErrorMessage('This command is only available for Markdown files.');
			return;
		}

		// Open the preview to the side
		await vscode.commands.executeCommand('markdown.showPreviewToSide');
	}
);

export function register_markdown_commands(context: vscode.ExtensionContext) {
	context.subscriptions.push(openMarkdownPreviewCommand);
}
