import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { extension_name } from '../../constants';
import { createNewTerminal, openWindowsCmdTerminal3 } from '../terminal';
import { getExplorerDirectoryPath } from '../file_dir';
import { getUserInputAndProcess } from '../multiline_input';
import { replaceEscapedNewlinesAndTabs } from '@/utils';
import { run_fmus_at_specific_dir } from '../fmus_ketik';
import { setConfigValue } from '@/configs';
import { update_config_cwd_statusbar_item } from '@/status_bar';
import { terminalCwdMap } from '../terminal_common';

let yutools_file_context_file_bantuan = vscode.commands.registerCommand(
	`${extension_name}.yutools_file_context_file_bantuan`,
	(uri: vscode.Uri) => {
		// Check if the given URI is a file
		const filePath = uri.fsPath;
		// Check if the path is a file
		// eslint-disable-next-line no-undef
		fs.stat(filePath, (err: Error | null, stats: fs.Stats) => {
			if (err) {
				vscode.window.showErrorMessage(`Error accessing file: ${err.message}`);
				return;
			}
			if (stats.isFile()) {
				// Get the containing directory
				const directoryPath = path.dirname(filePath);
				// vscode.window.showInformationMessage(`Containing directory: ${directoryPath}`);
				const terminalName = "Bantuan";
				const shellPath = "aid.bat"; // Change to "/bin/bash" or other shell if needed
				const shellArgs = [filePath];
				// Create the terminal and run `git init`
				const terminal = createNewTerminal(terminalName, directoryPath, shellPath, shellArgs);
			} else {
				vscode.window.showErrorMessage('The selected URI is not a file.');
			}
		});
	}
);

const yutools_file_context_open_terminal_for_file = vscode.commands.registerCommand(
	`${extension_name}.yutools_file_context_open_terminal_for_file`,
	(uri: vscode.Uri) => {
		if (uri && uri.fsPath) {
			const filePath = vscode.Uri.file(uri.fsPath).with({ path: uri.fsPath }).fsPath;
			const directoryPath = path.dirname(filePath);
			const terminal = vscode.window.createTerminal({ cwd: directoryPath });
			terminalCwdMap.set(terminal.name, directoryPath);
			terminal.show();
		} else {
			vscode.window.showErrorMessage('Failed to determine file directory.');
		}
	}
);

const yutools_file_context_git_init = vscode.commands.registerCommand(
	`${extension_name}.yutools_file_context_git_init`,
	(uri: vscode.Uri) => {
		if (uri && uri.fsPath) {
			const filePath = vscode.Uri.file(uri.fsPath).with({ path: uri.fsPath }).fsPath;
			const directoryPath = path.dirname(filePath);
			const terminal = vscode.window.createTerminal({ cwd: directoryPath });
			terminalCwdMap.set(terminal.name, directoryPath);
			terminal.show();
			terminal.sendText('git init');
		} else {
			vscode.window.showErrorMessage('Failed to determine file directory.');
		}
	}
);

const yutools_file_context_git_pull = vscode.commands.registerCommand(
	`${extension_name}.yutools_file_context_git_pull`,
	(uri: vscode.Uri) => {
		if (uri && uri.fsPath) {
			const filePath = vscode.Uri.file(uri.fsPath).with({ path: uri.fsPath }).fsPath;
			const directoryPath = path.dirname(filePath);
			const terminal = vscode.window.createTerminal({ cwd: directoryPath });
			terminalCwdMap.set(terminal.name, directoryPath);
			terminal.show();
			terminal.sendText('git pull');
		} else {
			vscode.window.showErrorMessage('Failed to determine file directory.');
		}
	}
);

const yutools_file_context_run_fmus = vscode.commands.registerCommand(
	`${extension_name}.yutools_file_context_run_fmus`,
	(uri: vscode.Uri) => {
		const filePath = vscode.Uri.file(uri.fsPath).with({ path: uri.fsPath }).fsPath;
		const directoryPath = path.dirname(filePath);
		getUserInputAndProcess(
			async (input: string) => {
				const processed_input = replaceEscapedNewlinesAndTabs(input);
				await run_fmus_at_specific_dir(processed_input, directoryPath);
			},
			"Enter FMUS code here:"
		);
	}
);

const yutools_file_context_set_cwd_to_here = vscode.commands.registerCommand(
	`${extension_name}.yutools_file_context_set_cwd_to_here`,
	async (uri: vscode.Uri) => {
		const filePath = vscode.Uri.file(uri.fsPath).with({ path: uri.fsPath }).fsPath;
		const directoryPath = path.dirname(filePath);
		// if (!filePath) {
		// 	filePath = getConfigValue('currentWorkingDirectory', getInvokedDirectory() as string);
		// }
		// const configuration = vscode.workspace.getConfiguration();
		// C:\ai\yutools\extensions\yutools\src\vsutils\configkeys.ts
		await setConfigValue<string>('currentWorkingDirectory', directoryPath);
		update_config_cwd_statusbar_item(directoryPath);
	}
);

const file_menu_wsl_rm_f = vscode.commands.registerCommand(
	`${extension_name}.file_menu_wsl_rm_f`,
	async (uri: vscode.Uri) => {
		const filePath = vscode.Uri.file(uri.fsPath).with({ path: uri.fsPath }).fsPath;
		const directoryPath = path.dirname(filePath);
		const confirmation = await vscode.window.showWarningMessage(
			`Are you sure you want to delete the file '${filePath}'? This action cannot be undone.`,
			{ modal: true }, // Makes the dialog modal
			"Yes", "No"
		);
		// If the user confirms, proceed with deletion
		if (confirmation === "Yes") {
			openWindowsCmdTerminal3({
				perintah: `rm -f ${filePath}`,
				name: "rm -f",
				cwd: directoryPath || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') as string,
			});
		} else {
			vscode.window.showInformationMessage("File deletion canceled.");
		}
	}
);

export function register_file_menu(context: vscode.ExtensionContext) {
	context.subscriptions.push(yutools_file_context_file_bantuan);
	context.subscriptions.push(yutools_file_context_open_terminal_for_file);
	context.subscriptions.push(yutools_file_context_git_init);
	context.subscriptions.push(yutools_file_context_git_pull);
	context.subscriptions.push(yutools_file_context_run_fmus);
	context.subscriptions.push(yutools_file_context_set_cwd_to_here);
	context.subscriptions.push(file_menu_wsl_rm_f);
}
