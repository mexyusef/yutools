import { main_file_templates } from '../../../constants';
import { openWindowsCmdTerminal } from '../../../handlers/terminal';
import {
	// openWindowsCmdTerminal,
	runTerminalCommand,
} from '../../../handlers/vsutils';

export async function runPreviewProjectInTerminal(framework: string) {
	const terminal = openWindowsCmdTerminal(undefined, framework);

	let perintah = main_file_templates[framework]["command"];

	perintah = perintah
		.replace(/__ROOTDIR__/g, main_file_templates[framework]["root"])
		.replace(/__PORT__/g, String(main_file_templates[framework]["port"]));

	await runTerminalCommand(terminal, perintah);
}
