import * as vscode from 'vscode';
import { ContentPanelProvider } from './provider';
import { WebviewMessage } from './shared/types';
import {
	create_original_statusbar_items,
	register_status_bar_commands,
	update_config_bantuan_statusbar_item,
	update_config_cwd_statusbar_item,
	update_config_upwork_statusbar_item,
} from './status_bar';
import { handleMessage } from './messages';
import { getConfigValue, setConfigValue } from './configs';
import { register_dir_menu } from './handlers/menus/dir_menu';
import { register_project_menu } from './handlers/menus/project_menu';
import { register_file_menu } from './handlers/menus/file_menu';
import { register_terminal_commands } from './handlers/commands/terminal';
import { register_sidebar_commands } from './handlers/commands/sidebar';
import { register_editor_menu } from './handlers/commands/editor';
import { register_widgets_menu } from './handlers/widgets/yuwidgets';
import { register_glassit } from './handlers/vendor/glassit';
import { register_search_menu } from './handlers/searchutils';
import { register_custom_input } from './handlers/multiline_input';
import { register_markdown_menu } from './handlers/commands/markdown';
import { register_widgets_processor } from './handlers/widgets/processor';
import { register_tools_menu } from './handlers/menus/tool_menu';
import { CodeApprovalLensProvider } from './pages/fulled-chat/CodeApprovalLensProvider';
import { register_fulled_commands } from './pages/fulled-chat/diff_commands';
import { DocumentCodeLensManager } from './pages/fulled-chat/DocumentCodeLensManager';
import { register_libraries_commands } from './libraries/commands';
import { register_llm_config_commands } from './pages/fmus-vscode/llm_config_commands';
import { FMUSCodeLensProvider } from './pages/fmus-vscode/codelens';
import { register_toggle_codelens } from './pages/fmus-vscode/codelens_command';
import { register_git_loop_command } from './libraries/client/git/gitloop';
import { register_git_loop_command_background } from './libraries/client/git/gitloop_background';
import { register_markdown_commands } from './libraries/client/files/markdown';
import { register_workspace_comands } from './libraries/client/editors/workspace_commands';
import { register_zen_mode } from './libraries/client/settings/zen';
import { register_panel_commands } from './libraries/client/settings/panel';
import { register_browser_commands } from './libraries/client/network/browser';
import { register_extensions_commands } from './libraries/client/settings/extensions';
import { register_explorer_commands } from './libraries/client/files/explorer';
import { register_packagejson_commands } from './libraries/client/files/packageJson';
import { register_tweet_commands } from './libraries/client/database/tweet';
import { register_fmus_vscode_commands } from './pages/fmus-vscode/fmus_vscode_commands';
import { register_system_commands } from './libraries/client/settings/system';
import { register_terminal_utilities_commands } from './libraries/client/terminal/terminal';
import { yubantu_activate, yubantu_deactivate } from './yubantu/extension';
import { register_bookmark_commands } from './libraries/client/settings/bookmark';
import { register_textfile_commands } from './libraries/client/editors/textfile';
import { register_format_commands } from './libraries/client/editors/formatOnSave';
import { register_llm_commands } from './libraries/ai';
import { register_errors_commands } from './libraries/client/errors';
import { register_databases_commands } from './libraries/database';
import { register_editor_streaming } from './libraries/client/editors/editor_streamer_command';
import { register_library_commands } from './libraries';
import { register_previews_commands } from './pages/fmus-vscode/previews';
import { provideHover } from './pages/fmus-vscode/provideHover';
import { FmusHoverProvider } from './libraries/client/hover/FmusHoverProvider';
import { imageHover } from './libraries/client/hover/imageHover';
import * as fs from 'fs';
import { setStorageContext } from './storage';
import { register_notes_panel } from './yunotes/extension';

export async function activate(context: vscode.ExtensionContext) {
	const globalStoragePath = context.globalStorageUri.fsPath;
	if (!fs.existsSync(globalStoragePath)) {
		fs.mkdirSync(globalStoragePath, { recursive: true });
	}
	setStorageContext(context);

	create_original_statusbar_items(context);
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
		const firstWorkspaceFolder = workspaceFolders[0].uri.fsPath;

		await setConfigValue('currentWorkingDirectory', firstWorkspaceFolder);
		update_config_cwd_statusbar_item(firstWorkspaceFolder);

		// await setConfigValue('currentBantuanWorkingDirectory', firstWorkspaceFolder);
		update_config_bantuan_statusbar_item(
			getConfigValue('currentBantuanWorkingDirectory', "C:\\hapus")
		);

		const workdir = getConfigValue('currentKerjaWorkingDirectory', firstWorkspaceFolder); // for quick project
		update_config_upwork_statusbar_item(workdir);
	}

	const webviewProvider = new ContentPanelProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			ContentPanelProvider.viewId,
			webviewProvider,
			{ webviewOptions: { retainContextWhenHidden: true } }
		),
	);

	const codeApprovalLensProvider = new CodeApprovalLensProvider();
	const documentCodeLensManager = new DocumentCodeLensManager();

	register_fulled_commands(
		context,
		codeApprovalLensProvider,
		documentCodeLensManager,
		webviewProvider,
	);

	const fmusCodeLensProvider = new FMUSCodeLensProvider();
	vscode.languages.registerCodeLensProvider("*", fmusCodeLensProvider);

	context.subscriptions.push(
		vscode.languages.registerHoverProvider('*', {
			provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
				return imageHover(document, position);
			}
		})
	);

	// const hoverProvider = new FmusHoverProvider();
	// context.subscriptions.push(
	// 		vscode.languages.registerHoverProvider('*', hoverProvider)
	// );

	webviewProvider.webview.then(
		webview => {
			webview.onDidReceiveMessage(async (message: WebviewMessage) => {
				await handleMessage(webview, message, codeApprovalLensProvider);
			});
		}
	);

	register_dir_menu(context);
	register_file_menu(context);
	register_project_menu(context);

	register_terminal_commands(context);
	register_sidebar_commands(context);
	register_editor_menu(context);

	register_widgets_menu(context);
	register_glassit(context);
	register_status_bar_commands(context);
	register_search_menu(context);
	register_custom_input(context);
	register_markdown_menu(context);
	register_widgets_processor(context);
	register_tools_menu(context);
	register_libraries_commands(context); // fileUtilsSearchFiles, jsonUtilsModifyJson
	register_llm_config_commands(context); // get_temperature, get_maxtokens, ...
	register_toggle_codelens(context); // togglePrimaryCommand
	register_git_loop_command(context);
	register_fmus_vscode_commands(context); // createProject etc C:\ai\yuagent\extensions\yutools\src\pages\fmus-vscode\fmus_vscode_commands.ts
	register_git_loop_command_background(context);
	register_markdown_commands(context); // openMarkdownPreviewCommand
	register_workspace_comands(context); // openFolderInNewWindowCommand, openFolderWrapperCommand
	register_zen_mode(context); // toggleZenModeCommand
	register_panel_commands(context); // toggleMaximizedPanel, togglePanelVisibility
	register_browser_commands(context); // visitChromeURLCommand, visitFirefoxURLCommand
	register_extensions_commands(context); // enableExtensions, disableExtensions
	register_explorer_commands(context); // collapseAllCommand, revealFileCommand2, searchAndRevealFileCommand
	register_packagejson_commands(context); // packageJsonAll, packageJsonDep, packageJsonDevDep
	register_system_commands(context);
	register_terminal_utilities_commands(context);
	register_format_commands(context);
	register_editor_streaming(context);
	// [20004:1220/150641.726:INFO:CONSOLE(31)] "Error: Activating extension 'mexyusef.yutools' failed: Could not locate the bindings file. Tried:
	// c:\ai\yuagent\build\node_sqlite3.node
	// c:\ai\yuagent\build\Debug\node_sqlite3.node
	// c:\ai\yuagent\build\Release\node_sqlite3.node
	// c:\ai\yuagent\out\Debug\node_sqlite3.node
	// c:\ai\yuagent\Debug\node_sqlite3.node
	// c:\ai\yuagent\out\Release\node_sqlite3.node
	// c:\ai\yuagent\Release\node_sqlite3.node
	// c:\ai\yuagent\build\default\node_sqlite3.node
	// c:\ai\yuagent\compiled\20.16.0\win32\x64\node_sqlite3.node
	// c:\ai\yuagent\addon-build\release\install-root\node_sqlite3.node
	// c:\ai\yuagent\addon-build\debug\install-root\node_sqlite3.node
	// c:\ai\yuagent\addon-build\default\install-root\node_sqlite3.node
	// c:\ai\yuagent\lib\binding\node-v123-win32-x64\node_sqlite3.node.", source: vscode-file://vscode-app/c:/ai/yuagent/out/vs/workbench/browser/parts/notifications/notificationsAlerts.js (31)
	// register_tweet_commands(context); // createTweet, editTweet, deleteTweet
	register_databases_commands(context);
	register_llm_commands(context);
	register_errors_commands(context);
	register_bookmark_commands(context);
	register_textfile_commands(context);
	yubantu_activate(context);
	register_library_commands(context);
	// register_fmus_vscode_commands(context);
	register_previews_commands(context);
	register_notes_panel(context);
}

export function deactivate() {
	yubantu_deactivate();
}
