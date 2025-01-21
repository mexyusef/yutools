import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { applyReplacements, preprocessString, processCommandWithMap } from '../stringutils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { createNewTerminal } from '../terminal';
import { getBasename } from '../file_dir';


const command_create = `npx --yes create-next-app@latest . --typescript --tailwind --eslint`;
const fmus_command = `.,d
	%FILE_SUMBER=C:\\ai\\aide\\extensions\\yutools\\src\\commands\\directory_context\\nextjs_shadcn.fmus
	%HTML_TITLE=My Automatic React App
	run.bat,f(n=npm run dev)
`;

export function register_dir_context_nextjs_shadcn_create(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.dir_context_nextjs_shadcn_create`, async (uri: vscode.Uri) => {
		const filePath = uri.fsPath;
		// buka terminal baru
		// jika bisa exec command langsung akan preferable
		// run fmus???

		// sendCommandsToTerminal();
		// const terminal = vscode.window.createTerminal({ name: "CMD", shellPath: 'cmd.exe' });
		// terminal.show();
		const terminal_name = getBasename(filePath)
		const terminal = createNewTerminal(terminal_name, filePath);
		terminal.sendText(command_create);
		// terminal.sendText(command_03);
		run_fmus_at_specific_dir(fmus_command, filePath);
	});
	context.subscriptions.push(disposable);
}
