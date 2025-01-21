import * as vscode from 'vscode';
import { callApiFunctionWithoutContext } from '../networkquery';
import { endpointMapping } from '../mapping';
import { getPromptAndContext } from '../../../handlers/commands/vendor';

export const changeConfiguration = vscode.commands.registerCommand(`yutools.changeConfiguration`,
	async () => {
		const { prompt, context } = await getPromptAndContext();
		if (prompt) {
			await callApiFunctionWithoutContext('/changeConfiguration', prompt, endpointMapping);
		}
	}
);
