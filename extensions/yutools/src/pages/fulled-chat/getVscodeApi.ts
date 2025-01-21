import { Command, WebviewMessage } from "./types";


// message -> res[]
const awaiting: { [c in Command]: ((res: any) => void)[] } = {
  "ctrl+l": [],
  "applyCode": [],
  "requestFiles": [],
  "files": [],
  "apiConfig": [],
  "getApiConfig": [],

  "message1": [],
  "new_file": [],
  "open_file_in_editor": [],
  "create_project": [],
  "cmd_terminal": [],

  "insert_clipboard": [],
  "text_to_clipboard": [],
  "clipboard_to_variable": [],

  'insert_editor_info': [],
  'toggle_terminal': [],
  'change_workspace': [],
  'insert_text_to_editor': [],
  'send_comand_to_terminal': [],
  'send_command_to_terminal_process_input': [],
  'send_commands_to_terminal': [],
  'send_commands_to_created_terminal': [],

  'send_indentation_to_terminal': [],
  'create_terminal_at_dir': [],

  'single_query_llm': [],
  'clear_active_editor': [],
  'saveas_active_editor': [],

  'get_hidden_prefix': [],
  'get_hidden_suffix': [],
  'reset_hidden_prefix': [],
  'reset_hidden_suffix': [],
  'set_hidden_prefix': [],
  'set_hidden_suffix': [],

  // ganti llm provider, belum ganti modelnya
  'change_active_llm': [],
  'change_active_llm_model': [],
  'open_url_in_browser': [],

  // lihat html, react, dll di webview di editor sebelah kanan
  'preview_project_framework_webview': [],
  // lihat html, react, dll di browser sistem
  'preview_project_framework_browser': [],
  // npm run dev di terminal, lalu lihat html, react, dll di webview di editor sebelah kanan
  'terminal_preview_project_framework_webview': [],
  // npm run dev di terminal, lalu lihat html, react, dll di browser sistem
  'terminal_preview_project_framework_browser': [],
  // isi App.tsx/app.py, npm run dev di terminal, lalu lihat html, react, dll di webview di editor sebelah kanan
  'swap_preview_project_framework': [],
  'swap_preview_project_framework_browser': [],



  'run_fmus_at_workspace_dir': [],
  'run_fmus_at_specific_dir': [],
  'run_ketik_at_workspace_dir': [],
  'run_ketik_at_specific_dir': [],

  'run_upwork_project_at_workspace_dir': [],
  'run_upwork_project_at_specific_dir': [],
  'run_job_at_workspace_dir': [], // job di sini ada mapping nya
  'run_job_at_specific_dir': [],

  'run_shellcmd_at_workspace_dir': [],
  'run_shellcmd_at_specific_dir': [],

  'selectDirectory': [],
  'getInvokeDirectory': [],
  'getCurrentWorkingDirectory': [],
  'setCurrentWorkingDirectory': [],

  'selector_backup_file_run_bantuan': [],
  'selector_run_bantuan': [],
  'selector_open_fulled': [],
  'selector_open_terminal': [],
  'selector_open_explorer': [],
  'selector_backup_file': [],

  'open_help_file': [],
  'backup_files': [],
  'open_files_in_editor': [],

  /////////////

  "pesan1": [],
  'terima_hidden_prefix': [],
  'terima_hidden_suffix': [],
  'from_backend_to_frontend_cwd_changed': [],
}

// use this function to await responses
export const awaitVSCodeResponse = <C extends Command>(c: C) => {
  let result: Promise<WebviewMessage & { type: C }> = new Promise((res, rej) => {
    awaiting[c].push(res)
  })
  return result
}

export const resolveAwaitingVSCodeResponse = (m: WebviewMessage) => {
  // resolve all promises for this message
  for (let res of awaiting[m.type]) {
    res(m)
    awaiting[m.type].splice(0) // clear the array
  }
}


// VS Code exposes the function acquireVsCodeApi() to us, it should only get called once
let vsCodeApi: ReturnType<AcquireVsCodeApiType> | undefined;

type AcquireVsCodeApiType = () => {
  postMessage(message: WebviewMessage): void;
  // setState(state: any): void; // getState and setState are made obsolete by us using { retainContextWhenHidden: true }
  // getState(): any;
};

export function getVSCodeAPI(): ReturnType<AcquireVsCodeApiType> {
  if (vsCodeApi)
    return vsCodeApi;

  try {
    // eslint-disable-next-line no-undef
    vsCodeApi = acquireVsCodeApi();
    return vsCodeApi!;
  } catch (error) {
    console.error('Failed to acquire VS Code API:', error);
    throw new Error('This script must be run in a VS Code webview context');
  }
}
