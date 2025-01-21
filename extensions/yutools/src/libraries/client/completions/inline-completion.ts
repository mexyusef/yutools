import * as vscode from 'vscode';

/**
 * Registers an inline completion provider for a specific document type.
 *
 * @param languageSelector - The language selector (e.g., `{ language: 'typescript' }`).
 * @param provideInlineCompletion - Function that provides inline completions.
 */
export function registerInlineCompletionProvider(
	languageSelector: vscode.DocumentSelector,
	provideInlineCompletion: (
		document: vscode.TextDocument,
		position: vscode.Position
	) => vscode.InlineCompletionItem[]
): vscode.Disposable {
	const provider: vscode.InlineCompletionItemProvider = {
		provideInlineCompletionItems(document, position) {
			return provideInlineCompletion(document, position);
		},
	};
	return vscode.languages.registerInlineCompletionItemProvider(languageSelector, provider);
}

/**
 * Registers custom commands for inline completion actions.
 *
 * @param context - The VSCode extension context.
 * @param commands - An object mapping command names to their implementations.
 */
export function registerCommands(
	context: vscode.ExtensionContext,
	commands: Record<string, (...args: any[]) => any>
): void {
	for (const [commandName, commandImplementation] of Object.entries(commands)) {
		const disposable = vscode.commands.registerCommand(commandName, commandImplementation);
		context.subscriptions.push(disposable);
	}
}

/**
 * Displays a status bar message with a specified text and duration.
 *
 * @param message - The text to display.
 * @param duration - The duration (in milliseconds) to display the message.
 */
export function showStatusBarMessage(message: string, duration: number): void {
	vscode.window.setStatusBarMessage(message, duration);
}

// import {
//   registerInlineCompletionProvider,
//   registerCommands,
//   showStatusBarMessage,
// } from './inline-completion';

// 1. Register an inline completion provider
registerInlineCompletionProvider({ language: 'typescript' }, (document, position) => {
	const wordRange = document.getWordRangeAtPosition(position);
	const word = wordRange ? document.getText(wordRange) : '';
	if (word === 'console') {
		return [new vscode.InlineCompletionItem('console.log()')];
	}
	return [];
});

// 2. Register commands
export function register_inline_completions(context: vscode.ExtensionContext) {
	registerCommands(context,
		{
			'myExtension.showMessage': () => vscode.window.showInformationMessage('Hello, world!'),
			'myExtension.showCompletion': () => showStatusBarMessage('Completions activated!', 3000),
		}
	);

}

// // 3. Show a status bar message
// showStatusBarMessage('Extension activated!', 5000);
