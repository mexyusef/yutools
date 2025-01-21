import * as vscode from 'vscode';
import { extension_name } from '@/constants';
import { getPromptAndContext } from '../../handlers/commands/vendor';
import { command_with_progressbar } from './common';
import { endpointMapping } from './mapping';
import { callApiFunctionWithoutContext } from './networkquery';

export function registerCommand(context: vscode.ExtensionContext, commandName: string) {
	context.subscriptions.push(

		vscode.commands.registerCommand(`${extension_name}.fmus-vscode.${commandName}`,
			async () => {
				const { prompt, context } = await getPromptAndContext();
				if (prompt) {
					if (command_with_progressbar.includes(commandName)) {
						vscode.window.withProgress({
							location: vscode.ProgressLocation.Notification,
							title: "Just a sec...",
							cancellable: false
						}, async (progress) => {
							// Indicate progress
							progress.report({ increment: 0 });
							// await callApiFunction(`/${commandName}`, prompt, context, endpointMapping);
							await callApiFunctionWithoutContext(`/${commandName}`, prompt, endpointMapping);
							// Report completion
							progress.report({ increment: 100 });
						});
					} else {
						// await callApiFunction(`/${commandName}`, prompt, context, endpointMapping);
						await callApiFunctionWithoutContext(`/${commandName}`, prompt, endpointMapping);
					}
				}
			}
		)

	);
}
