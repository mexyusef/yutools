import * as vscode from 'vscode';
import { extension_name } from '../../constants';
import { checkFolderAndPackageJson, checkFolderExists, getBasename, joiner } from '../file_dir';
import { applyReplacements, processCommandWithMap } from '../stringutils';
import { createNewTerminal, runCommandInTerminal } from '../terminal';
import { run_fmus_at_specific_dir } from '../fmus_ketik';

const command_v3 = `npm -y create vite@latest __VAR1__ -- --template react-ts`;

const fmus_code_wrapper = `
`;

const fmus_command = `.,d
	%DIR_PROYEK=__VAR1__
	DIR_PROYEK,d
		src,d
		run.bat,f(n=npm run dev)
		buat.bat,f(n=npm run build)
`;

export function register_dir_context_react_vite_create(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		`${extension_name}.dir_context_react_vite_create`,
		async (uri: vscode.Uri) => {
			const filePath = uri.fsPath;
			const terminal_name = getBasename(filePath);

			const result_map = await processCommandWithMap(command_v3);
			if (result_map === undefined) {
				vscode.window.showErrorMessage(`Process was canceled. No command to execute.`);
			} else {
				console.log('Processed Result:', result_map.result);
				console.log('Map:', result_map.map);
				const nama_proyek = applyReplacements(`__VAR1__`, result_map.map);
				const terminal = createNewTerminal(terminal_name, filePath);
				console.log(`dir_context_react_vite_create #1, folder: ${nama_proyek}`);
				// tunggu sampai folder proyek terbuat dan package.json ada
				await runCommandInTerminal(
					terminal,
					result_map.result,
					60000, // 1 menit
					// () => checkFolderAndPackageJson(nama_proyek, joiner(filePath, nama_proyek))
					() => checkFolderAndPackageJson(nama_proyek, filePath)
				);
				// terminal.sendText(result_map.result); // npm create vite@latest ...
				// terminal.sendText(applyReplacements(`cd __VAR1__ && npm i`, result_map.map)); // npm install
				// tunggu sampai node_modules folder terbuat
				console.log(`dir_context_react_vite_create #2`);
				await runCommandInTerminal(
					terminal,
					applyReplacements(`cd __VAR1__ && npm i`, result_map.map),
					60000, // 1 menit
					// () => checkFolderExists(`node_modules`, joiner(filePath, nama_proyek))
					() => checkFolderExists(`node_modules`, joiner(filePath, nama_proyek)),
					2000, // checkInterval 2 detik krn node modules lama...
				);
				// apply to fmus_command
				const fmus_command_replaced = applyReplacements(fmus_command, result_map.map); // replace __VAR1__
				// console.log('New FMUS Command:', fmus_command_replaced);
				run_fmus_at_specific_dir(fmus_command_replaced, filePath); // create *.bat etc
				terminal.sendText(`dir *.bat`); // terminal sudah cd __VAR1__ jadi bisa langsung work in rootdir
			}
		}
	);
	context.subscriptions.push(disposable);
}
