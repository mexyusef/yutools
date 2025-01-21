import * as vscode from 'vscode';
import * as path from 'path';
import { extension_name } from '../../constants';
import { ensureWslPath, getBasename, getExplorerDirectoryPath, getExplorerFilePath, getInvokedDirectory } from '../file_dir';
import { createNewTerminal, openWindowsCmdTerminal3 } from '../terminal';
import { setConfigValue, getConfigValue } from '../../configs';
import { update_config_cwd_statusbar_item } from '@/status_bar';
import { getUserInputAndProcess } from '../multiline_input';
import { run_fmus_at_specific_dir, run_shellcmd_at_specific_dir } from '../fmus_ketik';
import { replaceEscapedNewlinesAndTabs } from '@/utils';

const yutools_explorer_context_directory_git_init = vscode.commands.registerCommand(`${extension_name}.yutools_explorer_context_directory_git_init`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			// vscode.window.showInformationMessage(`Directory selected: ${directoryPath}`);
			// const selectedFolder = folderUri[0].fsPath;
			const terminalName = "Git Init Terminal";
			const shellPath = "cmd.exe"; // Change to "/bin/bash" or other shell if needed
			// const shellArgs = ["/c", "git init"];
			// Create the terminal and run `git init`
			const terminal = createNewTerminal(terminalName, directoryPath, shellPath); // , shellArgs);
			terminal.sendText('git init');
			vscode.window.showInformationMessage(`Git initialized in ${directoryPath}`);
		} else {
			vscode.window.showErrorMessage('The selected item is not a directory.');
		}
	}
);

const yutools_explorer_context_directory_git_pull = vscode.commands.registerCommand(`${extension_name}.yutools_explorer_context_directory_git_pull`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			// vscode.window.showInformationMessage(`Directory selected: ${directoryPath}`);
			// const selectedFolder = folderUri[0].fsPath;
			const terminalName = "Git Init Terminal";
			const shellPath = "cmd.exe"; // Change to "/bin/bash" or other shell if needed
			// const shellArgs = ["/c", "git init"];
			// Create the terminal and run `git init`
			const terminal = createNewTerminal(terminalName, directoryPath, shellPath); // , shellArgs);
			terminal.sendText('git pull');
			vscode.window.showInformationMessage(`Git initialized in ${directoryPath}`);
		} else {
			vscode.window.showErrorMessage('The selected item is not a directory.');
		}
	}
);

const yutools_explorer_context_directory_bantuan = vscode.commands.registerCommand(`${extension_name}.yutools_explorer_context_directory_bantuan`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			const terminalName = getBasename(directoryPath);
			// const terminalName = "Bantuan";
			const shellPath = "aid.bat";
			// const shellArgs = ["/c", "git init"];
			const terminal = createNewTerminal(terminalName, directoryPath, shellPath);
		} else {
			vscode.window.showErrorMessage('The selected item is not a directory.');
		}
	}
);
// export function yutools_explorer_context_directory_bantuan(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(yutools_explorer_context_directory_bantuan);
// }
//   {
//     "command": "yutools.set_current_working_directory_to_dir_selection",
//     "group": "Oprek dir (explorer)",
//     "when": "explorerResourceIsFolder"
//   },
const set_current_working_directory_to_dir_selection = vscode.commands.registerCommand(
	`${extension_name}.set_current_working_directory_to_dir_selection`,
	async (uri: vscode.Uri) => {
		// console.log(`set_current_working_directory_to_dir_selection called...uri = ${uri}`);
		let filePath = uri.fsPath;
		// console.log(`set_current_working_directory_to_dir_selection called...filePath = ${filePath}`);
		if (!filePath) {
			filePath = getConfigValue('currentWorkingDirectory', getInvokedDirectory() as string);
		}
		// const configuration = vscode.workspace.getConfiguration();
		// C:\ai\yutools\extensions\yutools\src\vsutils\configkeys.ts
		await setConfigValue<string>('currentWorkingDirectory', filePath);
		update_config_cwd_statusbar_item(filePath);
		// vscode.postMessage({
		// 	command: 'directorySelected',
		// 	directory: filePath
		// });
	}
);
const dir_context_run_fmus_here = vscode.commands.registerCommand(
	`${extension_name}.dir_context_run_fmus_here`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			// const terminalName = getBasename(directoryPath);
			// const terminal = createNewTerminal(terminalName, directoryPath);
			// terminal.show(true);
			getUserInputAndProcess(async (input: string) => {
				const processed_input = replaceEscapedNewlinesAndTabs(input);
				await run_fmus_at_specific_dir(processed_input, directoryPath);
			}, "Enter FMUS code here:");
		} else {
			vscode.window.showErrorMessage('The selected item is not a directory.');
		}
	}
);
const dir_context_run_gitk = vscode.commands.registerCommand(
	`${extension_name}.dir_context_run_gitk`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			run_shellcmd_at_specific_dir(`gitk`, directoryPath);
		} else {
			vscode.window.showErrorMessage('The selected item is not a directory.');
		}
	}
);
// export function register_dir_context_run_gitk(context: vscode.ExtensionContext) {}
//   {
//     "command": "yutools.dir_context_run_smartgit",
//     "group": "Oprek dir (explorer)",
//     "when": "explorerResourceIsFolder"
//   },
const dir_context_run_smartgit = vscode.commands.registerCommand(
	`${extension_name}.dir_context_run_smartgit`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			run_shellcmd_at_specific_dir("\"C:\\Program Files\\SmartGit\\bin\\smartgit.exe\" .", directoryPath);
		} else {
			vscode.window.showErrorMessage('The selected item is not a directory.');
		}
	}
);
// export function register_dir_context_run_smartgit(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(dir_context_run_smartgit);
// }
//   {
//     "command": "yutools.dir_context_run_git_extension",
//     "group": "Oprek dir (explorer)",
//     "when": "explorerResourceIsFolder"
//   },
// register_dir_context_run_git_extension(context);
// export function register_dir_context_run_git_extension(context: vscode.ExtensionContext) {}
const dir_context_run_git_extension = vscode.commands.registerCommand(
	`${extension_name}.dir_context_run_git_extension`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			run_shellcmd_at_specific_dir("\"C:\\Program Files\\GitExtensions\\GitExtensions.exe\" .", directoryPath);
		} else {
			vscode.window.showErrorMessage('The selected item is not a directory.');
		}
	}
);
//   {
//     "command": "yutools.yutools_explorer_context_directory_create_terminal",
//     "group": "Oprek dir (explorer)",
//     "when": "explorerResourceIsFolder"
//   },
// yutools_explorer_context_directory_create_terminal(context);
const yutools_explorer_context_directory_create_terminal = vscode.commands.registerCommand(
	`${extension_name}.yutools_explorer_context_directory_create_terminal`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			const terminalName = getBasename(directoryPath);
			// const terminalName = "Bantuan";
			// const terminalName = "Terminal";
			// const shellPath = "ls -al";
			const terminal = createNewTerminal(terminalName, directoryPath);
			// vscode.window.showInformationMessage(`Jalankan bantuan di ${directoryPath}`);
		} else {
			vscode.window.showErrorMessage('The selected item is not a directory.');
		}
	}
);

const yutools_explorer_context_directory_create_terminal_maximized = vscode.commands.registerCommand(
	`${extension_name}.yutools_explorer_context_directory_create_terminal_maximized`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			const terminalName = getBasename(directoryPath);
			// const terminalName = "Bantuan";
			// const terminalName = "Terminal Max";
			// const shellPath = "ls -al";
			const terminal = createNewTerminal(terminalName, directoryPath);
			// Show the terminal maximized
			terminal.show(true);
			// vscode.window.showInformationMessage(`Jalankan bantuan di ${directoryPath}`);
		} else {
			vscode.window.showErrorMessage('The selected item is not a directory.');
		}
	}
);

const dir_menu_serve_http_python = vscode.commands.registerCommand(
	`${extension_name}.dir_menu_serve_http_python`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			openWindowsCmdTerminal3({
				perintah: `python -m http.server"`,
				name: "Python Web Server",
				cwd: directoryPath || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') as string,
			});
		}
	}
);

const dir_menu_serve_http_node = vscode.commands.registerCommand(
	`${extension_name}.dir_menu_serve_http_node`,
	(uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			openWindowsCmdTerminal3({
				perintah: `npx http-server"`,
				name: "Node Web Server",
				cwd: directoryPath || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') as string,
			});
		}
	}
);

const dir_menu_wsl_rm_rf = vscode.commands.registerCommand(
	`${extension_name}.dir_menu_wsl_rm_rf`,
	async (uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			// ke atas sekali utk hapus
			const directoryPathParent = path.dirname(directoryPath);
			const confirmation = await vscode.window.showWarningMessage(
				`Are you sure you want to delete the directory '${directoryPath}'? This action cannot be undone.`,
				{ modal: true }, // Makes the dialog modal
				"Yes", "No"
			);
			// If the user confirms, proceed with deletion
			if (confirmation === "Yes") {
				openWindowsCmdTerminal3({
					// gak bisa wsl rm -rf krn windows path, hrs konversi ke unix path dulu
					perintah: `rm -rf ${directoryPath}`,
					name: "rm -rf",
					cwd: directoryPathParent || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') as string,
				});
			} else {
				vscode.window.showInformationMessage("Directory deletion canceled.");
			}
		}
	}
);

const dir_menu_wsl_rm_rf_content = vscode.commands.registerCommand(
	`${extension_name}.dir_menu_wsl_rm_rf_content`,
	async (uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			// ke atas sekali utk hapus
			const directoryPathParent = path.dirname(directoryPath);
			const confirmation = await vscode.window.showWarningMessage(
				`Are you sure you want to delete the content of directory '${directoryPath}'? This action cannot be undone.`,
				{ modal: true }, // Makes the dialog modal
				"Yes", "No"
			);
			// If the user confirms, proceed with deletion
			if (confirmation === "Yes") {
				const windows_path = `${directoryPath}\\*`;
				const wsl_path = ensureWslPath(windows_path);
				const perintah = `wsl rm -rf ${wsl_path}`;
				openWindowsCmdTerminal3({
					// gak bisa wsl rm -rf krn windows path, hrs konversi ke unix path dulu
					perintah,
					name: perintah,
					cwd: directoryPathParent || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') as string,
				});
			} else {
				vscode.window.showInformationMessage("Directory deletion canceled.");
			}
		}
	}
);

const search_text_in_folder = vscode.commands.registerCommand(
	'yutools.search_text_in_folder',
	async (uri: vscode.Uri) => {
		// Ask user for search string using quick input
		const searchString = await vscode.window.showInputBox({
			placeHolder: 'Enter the string to search for',
			prompt: 'Enter a string to search in files',
			validateInput: (input: string) => input.length === 0 ? 'Search string cannot be empty' : null
		});
		if (!searchString) {
			return; // If the user cancels or doesn't input anything, exit the command
		}
		const folderPath = uri.fsPath;
		// const command = `dir "${folderPath}" /s /b | findstr /i "${searchString}"`;
		// const command = `rg --glob "!node_modules/*" --glob ".git/*" "${searchString}"`;
		// C:\hapus\cline-1.0.4\cline-1.0.4\src>rg --glob "!node_modules/*" --glob ".git/*" "analyze"
		// rg: No files were searched, which means ripgrep probably applied a filter you didn't expect.
		// Running with --debug will show why files are being skipped.
		const command = `rg --glob "!node_modules/*" "${searchString}"`;
		// const terminal = vscode.window.createTerminal(`Search in ${path.basename(folderPath)}`);
		// terminal.sendText(command);
		// terminal.show();
		openWindowsCmdTerminal3({
			// gak bisa wsl rm -rf krn windows path, hrs konversi ke unix path dulu
			perintah: command,
			name: `Search in ${path.basename(folderPath)}`,
			cwd: folderPath || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') as string,
		});

	}
);

const dir_menu_wsl_rm_rf_ensure_wsl = vscode.commands.registerCommand(
	`${extension_name}.dir_menu_wsl_rm_rf_ensure_wsl`,
	async (uri: vscode.Uri) => {
		const directoryInfo = getExplorerDirectoryPath(uri);
		if (directoryInfo) {
			const { directoryPath } = directoryInfo;
			// ke atas sekali utk hapus
			const directoryPathParent = path.dirname(directoryPath);
			const confirmation = await vscode.window.showWarningMessage(
				`Are you sure you want to delete the directory '${directoryPath}'? This action cannot be undone.`,
				{ modal: true }, // Makes the dialog modal
				"Yes", "No"
			);
			const perintah_lengkap = `wsl rm -rf ${ensureWslPath(directoryPath)}`;
			if (confirmation === "Yes") {
				openWindowsCmdTerminal3({
					// gak bisa wsl rm -rf krn windows path, hrs konversi ke unix path dulu
					perintah: perintah_lengkap,
					name: perintah_lengkap,
					cwd: directoryPathParent || vscode.workspace.getConfiguration(extension_name).get('currentWorkingDirectory') as string,
				});
			} else {
				vscode.window.showInformationMessage("Directory deletion canceled.");
			}
		}
	}
);
//////////////////////////////////////////////////////////////////////////////////////////
export function register_dir_menu(context: vscode.ExtensionContext) {
	context.subscriptions.push(yutools_explorer_context_directory_git_init);
	context.subscriptions.push(yutools_explorer_context_directory_git_pull);
	context.subscriptions.push(yutools_explorer_context_directory_bantuan);
	context.subscriptions.push(set_current_working_directory_to_dir_selection);
	context.subscriptions.push(dir_context_run_fmus_here);
	context.subscriptions.push(dir_context_run_gitk);
	context.subscriptions.push(dir_context_run_smartgit);
	context.subscriptions.push(dir_context_run_git_extension);
	context.subscriptions.push(yutools_explorer_context_directory_create_terminal);
	context.subscriptions.push(yutools_explorer_context_directory_create_terminal_maximized);
	context.subscriptions.push(dir_menu_serve_http_python);
	context.subscriptions.push(dir_menu_serve_http_node);
	context.subscriptions.push(dir_menu_wsl_rm_rf);
	context.subscriptions.push(dir_menu_wsl_rm_rf_content);
	context.subscriptions.push(dir_menu_wsl_rm_rf_ensure_wsl);
	context.subscriptions.push(search_text_in_folder);
}
