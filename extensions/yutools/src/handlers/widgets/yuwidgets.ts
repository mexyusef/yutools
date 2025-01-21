import * as vscode from 'vscode';
import { extension_name } from '../../constants';

const editor_context_yuwidgets_widget1 = vscode.commands.registerCommand(
	`${extension_name}.yuwidgets_widget1`,
	async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			await vscode.commands.executeCommand('editor.action.Yuwidget1Widget');
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	}
);

const editor_context_yuwidgets_widget2 = vscode.commands.registerCommand(
	`${extension_name}.yuwidgets_widget2`,
	async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			await vscode.commands.executeCommand('editor.action.Yuwidget2Widget');
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	}
);

const editor_context_yuwidgets_widget3 = vscode.commands.registerCommand(
	`${extension_name}.yuwidgets_widget3`,
	async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			await vscode.commands.executeCommand('editor.action.Yuwidget3Widget');
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	}
);

const editor_context_yuwidgets_widget4 = vscode.commands.registerCommand(
	`${extension_name}.yuwidgets_widget4`,
	async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			await vscode.commands.executeCommand('editor.action.Yuwidget4Widget');
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	}
);

const editor_context_yuwidgets_widget5 = vscode.commands.registerCommand(
	`${extension_name}.yuwidgets_widget5`,
	async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			await vscode.commands.executeCommand('editor.action.Yuwidget5Widget');
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	}
);

const editor_context_yuwidgets_widget6 = vscode.commands.registerCommand(
	`${extension_name}.yuwidgets_widget6`,
	async () => {
		console.log(`memanggil Yuwidget6Widget...`);
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			// C:\ai\yuagent\src\vs\editor\browser\editorExtensions.ts
			await vscode.commands.executeCommand('editor.action.Yuwidget6Widget');
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	}
);

const browser_profile_buttons = vscode.commands.registerCommand(
	`${extension_name}.browser_profile_buttons`,
	async () => {
		console.log(`memanggil editor_context_browser_profile_buttons...`);
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			// C:\ai\yuagent\src\vs\editor\browser\editorExtensions.ts
			await vscode.commands.executeCommand('editor.action.BrowserProfileWidget');
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	}
);

export function register_widgets_menu(context: vscode.ExtensionContext) {
	context.subscriptions.push(editor_context_yuwidgets_widget1);
	context.subscriptions.push(editor_context_yuwidgets_widget2);
	context.subscriptions.push(editor_context_yuwidgets_widget3);
	context.subscriptions.push(editor_context_yuwidgets_widget4);
	context.subscriptions.push(editor_context_yuwidgets_widget5);
	context.subscriptions.push(editor_context_yuwidgets_widget6);
	context.subscriptions.push(browser_profile_buttons);
}
