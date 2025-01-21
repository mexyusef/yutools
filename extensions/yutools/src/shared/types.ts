import { ApiConfig } from '@/pages/fulled-chat/types';
import * as vscode from 'vscode';

// Define a reusable type for a single message
type LLMMessage = { role: 'system' | 'user' | 'assistant'; content: string };

// Define a reusable type for an array of messages
type LLMMessageArray = LLMMessage[];

// type TypedMessage<T extends string> = { type: T };
type TypedMessage<T extends string> = {
  type: T;
};

// type KeyValueMessage = { key: string; value: string };
type KeyValueMessage = {
  key: string;
  value: string;
};

type KeyMessage = {
  key: string;
};

type ContentMessage = {
  content: string;
};

type ResponseMessage = {
  response: string;
};

type ErrorMessage = {
  error: string;
};

type ConfigGetMessage = TypedMessage<'config-get'> & KeyMessage;
type ConfigSetMessage = TypedMessage<'config-set'> & KeyValueMessage;

type ChatRequestMessage = TypedMessage<'chat-request'> & { llmMessages?: LLMMessageArray, provider?: string };
type ChatResponseMessage = TypedMessage<'chat-response'> & ResponseMessage;
type ChatErrorMessage = TypedMessage<'chat-error'> & ErrorMessage;

type ApiConfigurationMessage = TypedMessage<'apiConfiguration'> & { key: string; value: string }; // Example
type CustomInstructionsMessage = TypedMessage<'customInstructions'>;
type AlwaysAllowReadOnlyMessage = TypedMessage<'alwaysAllowReadOnly'>;

type KirimPesanMessage = TypedMessage<'send-message'> & ContentMessage;
type CreateTerminalMessage = TypedMessage<'create-terminal'>;
type CreateTerminalAtDirMessage = TypedMessage<'create-terminal-dir'> & {
  folder: string;
  shellPath?: string;
  shellArgs?: string[];
};

type GetConfigResponseMessage = TypedMessage<'getConfigResponse'> & KeyValueMessage;
// type GetConfigRequestMessage = TypedMessage<'getConfigRequest'> & { key: string };
type GetConfigRequestMessage = TypedMessage<'getConfigRequest'> & KeyMessage;
// Add more message types as needed...

// Base fields shared by all messages
interface SharedMessageFields {
  text?: string;
  llmMessages?: LLMMessageArray;
  // apiConfiguration?: ApiConfiguration
  images?: string[];
  bool?: boolean;
}

// Discriminated union for all specific messages
type SpecificWebviewMessages =
  | ChatRequestMessage
  | ChatResponseMessage
  | ChatErrorMessage
  | ApiConfigurationMessage
  | CustomInstructionsMessage
  | AlwaysAllowReadOnlyMessage
  | CreateTerminalAtDirMessage
  | CreateTerminalMessage
  | KirimPesanMessage
  | GetConfigResponseMessage
  | GetConfigRequestMessage
  | ConfigGetMessage
  | ConfigSetMessage
  | { type: 'insert_text_to_editor', content: string }
  | { type: 'open_file_in_editor', filepath: string }
  | { type: 'text_to_clipboard', content: string }
  | { type: 'send_comand_to_terminal', command: string }
  | { type: 'run_fmus_at_specific_dir', text: string } //, dir: string }
  | { type: 'run_ketik_at_specific_dir', text: string } // , dir: string }
  | { type: 'run_shellcmd_at_specific_dir', text: string } // , dir: string }
  | { type: 'clear_active_editor' }
  | { type: 'saveas_active_editor' }
  | { type: 'change_active_llm' }
  | { type: 'change_active_llm_model' }
  | { type: 'open_url_in_browser', url: string }
  | { type: 'single_query_llm', content: string }
  | { type: 'open_help_file' }

  | { type: 'backup_files', files: string[] }
  | { type: 'open_files_in_editor', files: string[] }

  | { type: 'run_upwork_project_at_workspace_dir' }
  | { type: 'run_upwork_project_at_specific_dir' }
  | { type: 'run_job_at_workspace_dir' } // job di sini ada mapping nya
  | { type: 'run_job_at_specific_dir' }

  | { type: 'create_project', project: string, framework: string }

  | { type: 'selector_backup_file_run_bantuan', project: string }
  | { type: 'selector_run_bantuan', project: string }
  | { type: 'selector_open_fulled', project: string }
  | { type: 'selector_open_terminal', project: string }
  | { type: 'selector_open_explorer', project: string }
  | { type: 'selector_backup_file', project: string }

  | { type: 'terminal_preview_project_framework_webview', framework: string }
  | { type: 'terminal_preview_project_framework_browser', framework: string }
  | { type: 'preview_project_framework_webview', framework: string }
  | { type: 'preview_project_framework_browser', framework: string }
  | { type: 'swap_preview_project_framework', framework: string }
  | { type: 'swap_preview_project_framework_browser', framework: string }

  | { type: 'run_fmus_at_workspace_dir' }
  | { type: 'run_ketik_at_workspace_dir' }
  | { type: 'run_shellcmd_at_workspace_dir' }

  | { type: 'get_hidden_prefix' }
  | { type: 'get_hidden_suffix' }
  | { type: 'reset_hidden_prefix' }
  | { type: 'reset_hidden_suffix' }
  | { type: 'set_hidden_prefix', value: string }
  | { type: 'set_hidden_suffix', value: string }

  // editor -> sidebar
  | { type: 'ctrl+l', selection: Selection }
  | { type: 'files', files: { filepath: vscode.Uri, content: string }[] }
  | { type: 'apiConfig', apiConfig: ApiConfig }

  // sidebar -> editor
  | { type: 'requestFiles', filepaths: vscode.Uri[] }
  | { type: 'getApiConfig' }
  | { type: 'applyCode', code: string }

  // yubantu
  | { type: 'hello', text: string }
  ;

// Final WebviewMessage type
export type WebviewMessage = SpecificWebviewMessages & SharedMessageFields;
// export interface WebviewMessage {
// 	type:
//     | "chat-request"
// 		| "apiConfiguration"
// 		| "customInstructions"
// 		...
// 		| "openMention"
// 		| "cancelTask"
// 		| "refreshOpenRouterModels"
// 	text?: string
// 	llmMessages?: LLMMessageArray
// 	apiConfiguration?: ApiConfiguration
// 	images?: string[]
// 	bool?: boolean
// }

export interface ApiResponse {
  response: string;
}

type Command = WebviewMessage['type'];

export type {
  Command,
};

export interface ActiveConfig {
  active: string;
  options: string[];
}

export interface SecondaryActiveConfig {
  secondary_active: string;
  options: string[];
}

export interface ActiveModelConfig {
  active_model: string;
  options: string[];
}
