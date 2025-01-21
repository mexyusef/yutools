import * as vscode from 'vscode';
import { extension_name } from '../constants';
import { register_word_wrap_commands } from './word_wrap';

export const command_open_folder_to_set_cwd = "open_folder_to_set_cwd";
export const command_open_folder_to_set_bantuan_dir = "open_folder_to_set_bantuan_dir";
export const command_open_folder_to_set_kerja_dir = "open_folder_to_set_kerja_dir";

export const config_open_folder_to_set_cwd = "currentWorkingDirectory";
export const config_open_folder_to_set_bantuan_dir = "currentBantuanWorkingDirectory";
export const config_open_folder_to_set_kerja_dir = "currentKerjaWorkingDirectory";

export let config_cwd_statusbar_item: vscode.StatusBarItem;
export let config_bantuan_statusbar_item: vscode.StatusBarItem;
export let config_upwork_statusbar_item: vscode.StatusBarItem;


export function register_command_open_folder_to_set_kerja_dir(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.open_folder_to_set_kerja_dir`, async () => {
		const configuration = vscode.workspace.getConfiguration();
		let currentFolder = configuration.get<string>(`${extension_name}.currentKerjaWorkingDirectory`);
		if (!currentFolder) {
			// sebaiknya ubah dari process.cwd() ke get invoke directory
			currentFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
		}
		const folderUri = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			canSelectFiles: false,
			canSelectMany: false,
			defaultUri: vscode.Uri.file(currentFolder)
		});
		if (folderUri && folderUri[0]) {
			const folderPath = folderUri[0].fsPath;
			await vscode.workspace
				.getConfiguration()
				.update(
					`${extension_name}.currentKerjaWorkingDirectory`,
					folderPath,
					vscode.ConfigurationTarget.Global
				);
			vscode.window.showInformationMessage(`Project folder set to: ${folderPath}`);
			update_config_upwork_statusbar_item(folderPath);
		}
	});
	context.subscriptions.push(disposable);
}

export function register_command_open_folder_to_set_cwd(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.open_folder_to_set_cwd`, async () => {
		const configuration = vscode.workspace.getConfiguration();
		let currentFolder = configuration.get<string>(`${extension_name}.currentWorkingDirectory`);
		if (!currentFolder) {
			// sebaiknya ubah dari process.cwd() ke get invoke directory
			currentFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
		}
		const folderUri = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			canSelectFiles: false,
			canSelectMany: false,
			defaultUri: vscode.Uri.file(currentFolder)
		});
		if (folderUri && folderUri[0]) {
			const folderPath = folderUri[0].fsPath;
			await vscode.workspace.getConfiguration().update(
				`${extension_name}.currentWorkingDirectory`,
				folderPath,
				vscode.ConfigurationTarget.Global
			);
			vscode.window.showInformationMessage(`Project folder set to: ${folderPath}`);
			update_config_cwd_statusbar_item(folderPath);
		}
	});
	context.subscriptions.push(disposable);
}

export function register_command_open_folder_to_set_bantuan_dir(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(`${extension_name}.open_folder_to_set_bantuan_dir`, async () => {
		const configuration = vscode.workspace.getConfiguration();
		let currentFolder = configuration.get<string>(`${extension_name}.currentBantuanWorkingDirectory`);
		if (!currentFolder) {
			// sebaiknya ubah dari process.cwd() ke get invoke directory
			currentFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
		}
		const folderUri = await vscode.window.showOpenDialog({
			canSelectFolders: true,
			canSelectFiles: false,
			canSelectMany: false,
			defaultUri: vscode.Uri.file(currentFolder)
		});
		if (folderUri && folderUri[0]) {
			const folderPath = folderUri[0].fsPath;
			await vscode.workspace
				.getConfiguration()
				.update(
					`${extension_name}.currentBantuanWorkingDirectory`,
					folderPath,
					vscode.ConfigurationTarget.Global
				);
			vscode.window.showInformationMessage(`Project folder set to: ${folderPath}`);
			update_config_cwd_statusbar_item(folderPath);
		}
	});
	context.subscriptions.push(disposable);
}

export function update_config_cwd_statusbar_item(folderPath: string) {
	config_cwd_statusbar_item.text = `$(root-folder) ${folderPath.slice(0, 10)}..`;
	config_cwd_statusbar_item.tooltip = `currentWorkingDirectory: ${folderPath}`;
	config_cwd_statusbar_item.show();
}

export function update_config_bantuan_statusbar_item(folderPath: string) {
	config_bantuan_statusbar_item.text = `$(lightbulb) ${folderPath.slice(0, 10)}..`;
	config_bantuan_statusbar_item.tooltip = `currentBantuanWorkingDirectory: ${folderPath}`;
	config_bantuan_statusbar_item.show();
}

export function update_config_upwork_statusbar_item(folderPath: string) {
	config_upwork_statusbar_item.text = `$(briefcase) ${folderPath.slice(0, 10)}..`;
	config_upwork_statusbar_item.tooltip = `currentKerjaWorkingDirectory: ${folderPath}`;
	config_upwork_statusbar_item.show();
}
/////////////////////////// TAMBAHAN fmus-vscode
// export let statusBarItem: vscode.StatusBarItem;
export let temperatureStatusBarItem: vscode.StatusBarItem;
export let tokenStatusBarItem: vscode.StatusBarItem;
export let toppStatusBarItem: vscode.StatusBarItem;

export function updateTemperatureStatusBarItem(temperature: string = '0.0') {
	temperatureStatusBarItem.text = `T: ${temperature}`;
	// markdown menu
	temperatureStatusBarItem.show();
}

export function createTemperatureStatusBarItem(context: vscode.ExtensionContext) {
	if (!temperatureStatusBarItem) {
		temperatureStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		temperatureStatusBarItem.command = `${extension_name}.setTemperature`;
		context.subscriptions.push(temperatureStatusBarItem);
		// console.log(`statusbar createTemperatureStatusBarItem`);
	}
}

export function updateTokentatusBarItem(max_tokens: string = '4096') {
	tokenStatusBarItem.text = `K: ${max_tokens}`;
	tokenStatusBarItem.show();
}

export function createTokenStatusBarItem(context: vscode.ExtensionContext) {
	if (!tokenStatusBarItem) {
		tokenStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		tokenStatusBarItem.command = `${extension_name}.setMaxTokens`;
		context.subscriptions.push(tokenStatusBarItem);
		// console.log(`statusbar createTokenStatusBarItem`);
	}
}

export function updateTopPtatusBarItem(top_p: string = '0.0') {
	toppStatusBarItem.text = `P: ${top_p}`;
	toppStatusBarItem.show();
}

export function createTopPStatusBarItem(context: vscode.ExtensionContext) {
	if (!toppStatusBarItem) {
		toppStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		toppStatusBarItem.command = `${extension_name}.setTopP`;
		context.subscriptions.push(toppStatusBarItem);
		// console.log(`statusbar createTopPStatusBarItem`);
	}
}

export function create_config_cwd_statusbar_item(context: vscode.ExtensionContext) {
	if (!config_cwd_statusbar_item) {
		config_cwd_statusbar_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		config_cwd_statusbar_item.command = `${extension_name}.open_folder_to_set_cwd`;
		context.subscriptions.push(config_cwd_statusbar_item);
	}
}
export function create_config_bantuan_statusbar_item(context: vscode.ExtensionContext) {
	if (!config_bantuan_statusbar_item) {
		config_bantuan_statusbar_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		config_bantuan_statusbar_item.command = `${extension_name}.open_folder_to_set_bantuan_dir`;
		context.subscriptions.push(config_bantuan_statusbar_item);
	}
}

export function create_config_upwork_statusbar_item(context: vscode.ExtensionContext) {
	if (!config_upwork_statusbar_item) {
		config_upwork_statusbar_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		config_upwork_statusbar_item.command = `${extension_name}.open_folder_to_set_upwork_dir`;
		context.subscriptions.push(config_upwork_statusbar_item);
	}
}

export function create_original_statusbar_items(context: vscode.ExtensionContext) {
	create_config_cwd_statusbar_item(context);
	create_config_bantuan_statusbar_item(context);
	create_config_upwork_statusbar_item(context);
	// console.log(`
	// 	create_original_statusbar_items
	// 	status bar gaya yutools sudah
	// 	status bar gaya fmus-vscode baru mau
	// `);
	// gak perlu nih: T, K, P
	// createTemperatureStatusBarItem(context);
	// updateTemperatureStatusBarItem('0.2'); // hanya bisa tampil jk update
	// createTokenStatusBarItem(context);
	// updateTokentatusBarItem('8196');
	// createTopPStatusBarItem(context);
	// updateTopPtatusBarItem('0.9');
}

export function register_status_bar_commands(context: vscode.ExtensionContext) {
	register_command_open_folder_to_set_cwd(context);
	register_command_open_folder_to_set_bantuan_dir(context);
	register_command_open_folder_to_set_kerja_dir(context);
	register_word_wrap_commands(context);
}
