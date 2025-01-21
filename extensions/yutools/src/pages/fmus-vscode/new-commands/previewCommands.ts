import * as vscode from 'vscode';
import { main_file_templates } from '../../../constants';
import { swapFileRunInTerminalPreview } from '../previews/swapFileRunInTerminalPreview';
import { previewProjectOnBrowser } from '../previews/previewProjectOnBrowser';
import { previewProjectOnWebviewBeside } from '../previews/previewProjectOnWebviewBeside';
import { runPreviewProjectInTerminalAndPreview } from '../previews/runPreviewProjectInTerminalAndPreview';
import { runPreviewProjectInTerminal } from '../previews/runPreviewProjectInTerminal';

const selectFramework = async () => {
	const frameworks = Object.keys(main_file_templates);
	const selectedFramework = await vscode.window.showQuickPick(frameworks, {
		placeHolder: 'Select a framework'
	});

	if (selectedFramework) {
		return selectedFramework;
	}
	return undefined;
}

// Command to swap file content and run in terminal
const swapFileRunInTerminalCommand = vscode.commands.registerCommand('yutools.previews.swapFileRunInTerminal', async () => {
	const framework = await selectFramework();
	if (framework) await swapFileRunInTerminalPreview(framework);
});

// Command to preview project in browser
const previewProjectOnBrowserCommand = vscode.commands.registerCommand('yutools.previews.previewProjectOnBrowser', async () => {
	const framework = await selectFramework();
	if (framework) previewProjectOnBrowser(framework);
});

// Command to preview project in webview beside
const previewProjectOnWebviewBesideCommand = vscode.commands.registerCommand('yutools.previews.previewProjectOnWebviewBeside', async () => {
	const framework = await selectFramework();
	if (framework) previewProjectOnWebviewBeside(framework);
});

// Command to run preview project in terminal and preview
const runPreviewProjectInTerminalAndPreviewCommand = vscode.commands.registerCommand('yutools.previews.runPreviewProjectInTerminalAndPreview', async () => {
	const framework = await selectFramework();
	if (framework) await runPreviewProjectInTerminalAndPreview(framework);
});

// Command to run preview project in terminal
const runPreviewProjectInTerminalCommand = vscode.commands.registerCommand('yutools.previews.runPreviewProjectInTerminal', async () => {
	const framework = await selectFramework();
	if (framework) await runPreviewProjectInTerminal(framework);
});


export function registerPreviewCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		swapFileRunInTerminalCommand,
		previewProjectOnBrowserCommand,
		previewProjectOnWebviewBesideCommand,
		runPreviewProjectInTerminalAndPreviewCommand,
		runPreviewProjectInTerminalCommand
	);
}
