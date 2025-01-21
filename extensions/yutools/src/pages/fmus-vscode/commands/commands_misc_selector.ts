import * as vscode from 'vscode';
import axios from 'axios';
import { getPromptAndContext, insertTextInEditor } from '../../../handlers/commands/vendor';
import { API_BASE_URL } from '../../../constants';

export const commands_misc_selector = vscode.commands.registerCommand(`yutools.commands_misc_selector`, async () => {
	const learn_languages = [
		"learn_english",
		"learn_spanish",
		"learn_german",
		"learn_russian",
		"learn_dutch",
		"learn_french",
		"learn_mandarin",

		"learn_programming",
	];
	const commands: string[] = [
		"Hackernews",
		"Analyze_Page",
		"Analyze_Text",
		"fix_grammar",
		...learn_languages
	];
	const selectedCommand = await vscode.window.showQuickPick(commands, {
		placeHolder: 'Select command to execute'
	});
	// if (learn_languages.includes(selectedCommand as string)) {
	// 	let { prompt, context } = await getPromptAndContext(0, false);
	// } else {
	// 	let { prompt, context } = await getPromptAndContext();
	// }
	if (selectedCommand) {
		let prompt: string | undefined;
		let context: string | undefined;

		if (learn_languages.includes(selectedCommand as string)) { // prompt undefined
			({ prompt, context } = await getPromptAndContext(0, false)); // false: jangan munculkan dialog jk selection/line empty
			if (prompt === undefined)
				prompt = "";
		} else {
			({ prompt, context } = await getPromptAndContext());
		}
		console.log(`selectedCommand: ${selectedCommand}`);
		const response = await axios.post(`${API_BASE_URL}/select_misc_command`, {
			command: selectedCommand,
			prompt,
		});
		insertTextInEditor(response.data.response);
	}
});
