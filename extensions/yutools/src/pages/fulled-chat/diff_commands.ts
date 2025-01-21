import * as vscode from 'vscode';
import { CodeApprovalLensProvider } from './CodeApprovalLensProvider';
import { viewcontainer_activitybar_command_name } from '@/constants';
import { ContentPanelProvider } from '@/provider';
import { WebviewMessage } from './types';
import { DocumentCodeLensManager } from './DocumentCodeLensManager';


export async function register_fulled_commands(
	context: vscode.ExtensionContext,
	codeApprovalLensProvider: CodeApprovalLensProvider,
	documentCodeLensManager: DocumentCodeLensManager,
	webviewProvider: ContentPanelProvider,
) {

	context.subscriptions.push(vscode.languages.registerCodeLensProvider('*', codeApprovalLensProvider));
	context.subscriptions.push(vscode.languages.registerCodeLensProvider('*', documentCodeLensManager));

	context.subscriptions.push(vscode.commands.registerCommand('yutools.approveDiff',
		async (params) => {
			codeApprovalLensProvider.approveDiff(params)
		})
	);
	context.subscriptions.push(vscode.commands.registerCommand('yutools.discardDiff',
		async (params) => {
			codeApprovalLensProvider.discardDiff(params)
		})
	);

	context.subscriptions.push(vscode.commands.registerCommand('yutools.ctrl+l',
		() => {
			const editor = vscode.window.activeTextEditor
			if (!editor) return
			// show the sidebar
			vscode.commands.executeCommand(viewcontainer_activitybar_command_name);

			const selectionStr = editor.document.getText(editor.selection);

			const selectionRange = editor.selection;

			const filePath = editor.document.uri;

			webviewProvider.webview.then(
				webview => webview.postMessage(
					{ type: 'ctrl+l', selection: { selectionStr, selectionRange, filePath } } satisfies WebviewMessage
				)
			);
		})
	);

	context.subscriptions.push(vscode.commands.registerCommand('void.ctrl+k',
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor)
				return
			documentCodeLensManager.addNewCodeLens(editor.document, editor.selection);
			// apparently this refreshes the codelenses by having the internals call provideCodeLenses
			// vscode.commands.executeCommand('editor.action.showHover');
		})
	);

}