import * as vscode from 'vscode';

export type ApiConfig = {
	anthropic: {
		apikey: string,
	},
	openai: {
		apikey: string
	},
	greptile: {
		apikey: string,
		githubPAT: string,
		repoinfo: {
			remote: string, // e.g. 'github'
			repository: string, // e.g. 'voideditor/void'
			branch: string // e.g. 'main'
		}
	},
	ollama: {
		endpoint: string,
		model: string
	},
	whichApi: string
}

export type OnText = (newText: string, fullText: string) => void

export type OnFinalMessage = (input: string) => void;

export interface SendLLMMessageParams {
	messages: LLMMessage[];
	onText: OnText;
	onFinalMessage: OnFinalMessage;
	apiConfig: ApiConfig;
}

export type SendLLMMessageFn = (params: SendLLMMessageParams) => {
	abort: () => void;
};

export type LLMMessage = {
	role: 'user' | 'assistant',
	content: string
}

export type SendLLMMessageFnTypeInternal = (params: {
	messages: LLMMessage[],
	onText: OnText,
	onFinalMessage: (input: string) => void,
	apiConfig: ApiConfig,
})
	=> {
		abort: () => void
	}


export type SendLLMMessageFnTypeExternal = (params: {
	messages: LLMMessage[],
	onText: OnText,
	onFinalMessage: (input: string) => void,
	apiConfig: ApiConfig | null,
})
	=> {
		abort: () => void
	}


export type Selection = { selectionStr: string, selectionRange: vscode.Range, filePath: vscode.Uri }

export type File = { filepath: vscode.Uri, content: string }

export type WebviewMessage = (
	// editor -> sidebar
	| { type: 'ctrl+l', selection: Selection } // user presses ctrl+l in the editor
	| { type: 'files', files: { filepath: vscode.Uri, content: string }[] }
	| { type: 'apiConfig', apiConfig: ApiConfig }

	// sidebar -> editor
	| { type: 'applyCode', code: string } // user clicks "apply" in the sidebar
	| { type: 'requestFiles', filepaths: vscode.Uri[] }
	| { type: 'getApiConfig' }

	// kita perkenalkan jenis baru: message dan pesan
	// message dari webview ke editor
	| { type: 'message1', content: string }
	| { type: 'new_file', content: string }
	| { type: 'open_file_in_editor', filepath: string }
	| { type: 'create_project', project: string, framework: string }
	| { type: 'cmd_terminal' }

	| { type: 'insert_clipboard' } // insert clipboard ke active editor at cursor
	| { type: 'text_to_clipboard', content: string }
	| { type: 'clipboard_to_variable' }
	| { type: 'insert_editor_info' }
	| { type: 'toggle_terminal' }
	| { type: 'change_workspace' }
	| { type: 'insert_text_to_editor', content: string }
	| { type: 'send_comand_to_terminal', command: string }
	| { type: 'send_command_to_terminal_process_input', command: string }
	| { type: 'send_commands_to_terminal', commands: string[] }
	| { type: 'send_commands_to_created_terminal', commands: string[] }
	| { type: 'send_indentation_to_terminal', indentation: string }
	| { type: 'create_terminal_at_dir', folder: string, shellPath?: string, shellArgs?: string[] }
	| { type: 'single_query_llm', content: string }
	| { type: 'clear_active_editor' }
	| { type: 'saveas_active_editor' }
	| { type: 'get_hidden_prefix' }
	| { type: 'get_hidden_suffix' }
	| { type: 'reset_hidden_prefix' }
	| { type: 'reset_hidden_suffix' }
	| { type: 'set_hidden_prefix', value: string }
	| { type: 'set_hidden_suffix', value: string }
	| { type: 'change_active_llm' }
	| { type: 'change_active_llm_model' }
	| { type: 'open_url_in_browser', url: string }
	| { type: 'terminal_preview_project_framework_webview', framework: string }
	| { type: 'terminal_preview_project_framework_browser', framework: string }
	| { type: 'preview_project_framework_webview', framework: string }
	| { type: 'preview_project_framework_browser', framework: string }
	| { type: 'swap_preview_project_framework', framework: string }
	| { type: 'swap_preview_project_framework_browser', framework: string }


	| { type: 'run_fmus_at_workspace_dir' }
	| { type: 'run_ketik_at_workspace_dir' }
	| { type: 'run_shellcmd_at_workspace_dir' }

	| { type: 'run_fmus_at_specific_dir', text: string, dir: string }
	| { type: 'run_ketik_at_specific_dir', text: string, dir: string }
	| { type: 'run_shellcmd_at_specific_dir', text: string, dir: string }

	| { type: 'run_upwork_project_at_workspace_dir' }
	| { type: 'run_upwork_project_at_specific_dir' }
	| { type: 'run_job_at_workspace_dir' } // job di sini ada mapping nya
	| { type: 'run_job_at_specific_dir' }

	| { type: 'selectDirectory' }
	| { type: 'getInvokeDirectory' }

	| { type: 'getCurrentWorkingDirectory' }
	| { type: 'setCurrentWorkingDirectory', from_ui: boolean } // from_ui: utk hindari recursive/loop ui => ext => ui => ext
	// hanya jika from_ui false maka messageHandler mengirim postMessage

	| { type: 'selector_backup_file_run_bantuan', project: string }
	| { type: 'selector_run_bantuan', project: string }
	| { type: 'selector_open_fulled', project: string }
	| { type: 'selector_open_terminal', project: string }
	| { type: 'selector_open_explorer', project: string }
	| { type: 'selector_backup_file', project: string }

	| { type: 'open_help_file' }
	| { type: 'backup_files', files: string[] }
	| { type: 'open_files_in_editor', files: string[] }
	//////////////////////////////////////
	// pesan dari editor ke webview
	| { type: 'pesan1', content: string }
	| { type: 'terima_hidden_prefix', nilai: string }
	| { type: 'terima_hidden_suffix', nilai: string }

	// ini cukup gak ya: webview.postMessage({ command: 'directorySelected', directory: currentDirSetting });
	| { type: 'from_backend_to_frontend_cwd_changed', directory: string }
	// | { type: 'broadcast_config', group: string, value: string }

)

export type Command = WebviewMessage['type']

// export {
// 	Selection,
// 	File,
// 	WebviewMessage,
// 	Command,
// }


export type ChatMessage =
	| {
		role: 'user';
		content: string;
		displayContent: string;
		selection: Selection | null;
		files: vscode.Uri[];
	}
	| {
		role: 'assistant';
		content: string;
		displayContent: string;
	};
