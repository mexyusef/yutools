import * as vscode from 'vscode';
import { WebviewMessage } from './shared/types';
import { createNewTerminal, openWindowsCmdTerminal } from './handlers/terminal';
import { getCompletionXai } from './handlers/api/providers/xai';
import { getCompletionGemini } from './handlers/api/providers/gemini';
import { getCompletionGroq } from './handlers/api/providers/groq';
import { getCompletionSambanova } from './handlers/api/providers/sambanova';
import { getCompletionHyperbolic } from './handlers/api/providers/hyperbolic';
import { getChatCompletion } from './handlers/api/llm';
import { LLMMessageArray } from './handlers/api/providers/config_getter_setter';
import { clearActiveEditor, createNewUntitledFile, getInvokedDirectory, insertTextAtCursor_createActiveEditor, openFileInEditor, openFilesInEditor, saveAsCurrentFile, sendCommandToActiveTerminal } from './handlers/editorutils';
import { copyTextToClipboard } from './handlers/commands/clipboard';
import { run_fmus_at_specific_dir, run_ketik_at_specific_dir, run_shellcmd_at_specific_dir } from './handlers/fmus_ketik';
import { openAddressInBrowser, query_llm } from './handlers/networkutils';
import { DEFAULT_MARKDOWN_FILE_PATH } from './constants';
import { getConfigValue } from './configs';
import { selectActiveLLMProvider, selectActiveModel } from './handlers/llm_query';
import { command_selector_backup_main_file, command_selector_modify_app_file_then_run_bantuan, command_selector_open_app_in_folder, command_selector_open_app_in_fulled, command_selector_open_app_in_terminal, command_selector_run_bantuan } from './handlers/commands/bantuan_command';
import { backup_files } from './handlers/commands/backup_file';
import { preview_project, preview_project_browser, swap_and_preview, terminal_and_preview_project } from './handlers/commands/swap_preview';
import { getApiConfig, readFileContentOfUri } from './pages/fulled-chat/utils';
import { getDiffedLines } from './pages/fulled-chat/getDiffedLines';
import { CodeApprovalLensProvider } from './pages/fulled-chat/CodeApprovalLensProvider';


// C:\ai\yuagent\extensions\yutools\src\handlers\api\providers\gemini.ts
// C:\ai\yuagent\extensions\yutools\src\handlers\api\providers\hyperbolic.ts
// C:\ai\yuagent\extensions\yutools\src\handlers\api\providers\sambanova.ts
// C:\ai\yuagent\extensions\yutools\src\handlers\api\providers\groq.ts
// C:\ai\yuagent\extensions\yutools\src\handlers\api\providers\xai.ts
type Provider = keyof typeof generator_map;
const generator_map = {
  'xai': getCompletionXai,
  'gemini': getCompletionGemini,
  'groq': getCompletionGroq,
  'sambanova': getCompletionSambanova,
  'hyperbolic': getCompletionHyperbolic,
};

export async function handleMessage(
  webview: vscode.Webview,
  message: WebviewMessage,
  approvalCodeLensProvider: CodeApprovalLensProvider
) {
  if (message.type === 'chat-request') {
    // // const provider = message.provider || 'xai'; // Default to 'xai' if provider is not given
    const provider: Provider = (message.provider as Provider) || 'xai';
    // const generatorFunction: any = generator_map[provider];
    // console.log(`messages.ts, provider: ${provider}`);
    const generatorFunction = getChatCompletion;
    if (generatorFunction) {
      try {
        const response = await generatorFunction(message.llmMessages as LLMMessageArray); // Call the function with llmMessages as argument
        webview.postMessage({
          type: 'chat-response',
          response: response
        });
        console.log(`messages.ts, response: ${JSON.stringify(response)}`);
      } catch (error: any) {
        webview.postMessage({
          type: 'chat-error',
          error: error.message
        });
      }
    } else {
      console.error(`Unknown provider: ${provider}`);
    }
  }
  else if (message.type === 'getConfigRequest') {
  }
  else if (message.type === 'send-message') {
    vscode.window.showInformationMessage(message.content);
  }
  else if (message.type === 'create-terminal') {
    openWindowsCmdTerminal();;
  }
  else if (message.type === 'create-terminal-dir') {
    const shellPath = message.shellPath ? message.shellPath : undefined;
    const shellArgs = message.shellArgs ? message.shellArgs : undefined;
    createNewTerminal(
      "T",
      message.folder,
      shellPath,
      shellArgs
    );
  }
  else if (message.type === 'insert_text_to_editor') {
    await insertTextAtCursor_createActiveEditor(message.content, true);
  }
  else if (message.type === 'open_file_in_editor') {
    await openFileInEditor(message.filepath);
  }
  else if (message.type === 'text_to_clipboard') {
    await copyTextToClipboard(message.content);
  }

  else if (message.type === 'send_comand_to_terminal') {
    sendCommandToActiveTerminal(message.command);
  }
  else if (message.type === 'run_fmus_at_specific_dir') {
    // let lokasi = message.dir;
    // if (lokasi === undefined) { lokasi = getInvokedDirectory() as string }
    const lokasi = getInvokedDirectory() as string;
    await run_fmus_at_specific_dir(message.text, lokasi);
  }
  else if (message.type === 'run_ketik_at_specific_dir') {
    const lokasi = getInvokedDirectory() as string;
    await run_ketik_at_specific_dir(message.text, lokasi);
  }
  else if (message.type === 'run_shellcmd_at_specific_dir') {
    const lokasi = getInvokedDirectory() as string;
    run_shellcmd_at_specific_dir(message.text, lokasi, true);
  }
  else if (message.type === 'single_query_llm') {
    await query_llm(message.content);
  }
  else if (message.type === 'open_help_file') {
    const helpFilePath: string = getConfigValue<string>('helpFilePath', DEFAULT_MARKDOWN_FILE_PATH);
    try {
      // Open the file or folder in VS Code
      const document = await vscode.workspace.openTextDocument(helpFilePath);
      await vscode.window.showTextDocument(document);
      // agar muncul di kanan
      vscode.commands.executeCommand('yutools.show_markdown_help'); // tampilkan di kanan
    } catch (error: any) {
      console.error(`Error opening file in VS Code: ${error.message}`);
    }
  }
  else if (message.type === 'clear_active_editor') {
    clearActiveEditor();
  }
  else if (message.type === 'saveas_active_editor') {
    await saveAsCurrentFile();
  }
  else if (message.type === 'change_active_llm') {
    selectActiveLLMProvider();
  }
  else if (message.type === 'change_active_llm_model') {
    selectActiveModel();
  }
  else if (message.type === 'open_url_in_browser') {
    openAddressInBrowser(message.url);
  }
  ////////////////////////////// previews: start
  else if (message.type === 'selector_backup_file_run_bantuan') {
    command_selector_modify_app_file_then_run_bantuan(message.project);
  }

  else if (message.type === 'selector_run_bantuan') {
    command_selector_run_bantuan(message.project);
  }

  else if (message.type === 'selector_open_fulled') {
    command_selector_open_app_in_fulled(message.project);
  }

  else if (message.type === 'selector_open_terminal') {
    command_selector_open_app_in_terminal(message.project);
  }

  else if (message.type === 'selector_open_explorer') {
    command_selector_open_app_in_folder(message.project);
  }

  else if (message.type === 'selector_backup_file') {
    command_selector_backup_main_file(message.project);
  }

  else if (message.type === 'backup_files') {
    backup_files(message.files);
  }

  else if (message.type === 'open_files_in_editor') {
    await openFilesInEditor(message.files);
  }

  // | { type: 'terminal_preview_project_framework_webview', framework: string }
  // | { type: 'terminal_preview_project_framework_browser', framework: string }
  // | { type: 'preview_project_framework_webview', framework: string }
  // | { type: 'preview_project_framework_browser', framework: string }
  // | { type: 'swap_preview_project_framework', framework: string }
  // | { type: 'swap_preview_project_framework_browser', framework: string }
  else if (message.type === 'terminal_preview_project_framework_webview') {
    await terminal_and_preview_project(message.framework);
  }
  else if (message.type === 'terminal_preview_project_framework_browser') {
    await terminal_and_preview_project(message.framework, true);
  }
  else if (message.type === 'preview_project_framework_webview') {
    preview_project(message.framework);
  }
  else if (message.type === 'preview_project_framework_browser') {
    preview_project_browser(message.framework);
  }
  else if (message.type === 'swap_preview_project_framework') {
    await swap_and_preview(message.framework);
  }
  else if (message.type === 'swap_preview_project_framework_browser') {
    await swap_and_preview(message.framework, true);
  }
  ////////////////////////////// previews: end
  ////////////////////////////// fulled-chat: start

  // dihandle oleh webview
  // | { type: 'ctrl+l', selection: Selection }
  // | { type: 'files', files: { filepath: vscode.Uri, content: string }[] }
  // | { type: 'apiConfig', apiConfig: ApiConfig }
  // else if (message.type === 'ctrl+l') {
  // }
  // else if (message.type === 'files') {
  // }
  // else if (message.type === 'apiConfig') {
  // }


  // // sidebar -> editor
  // | { type: 'requestFiles', filepaths: vscode.Uri[] }
  // | { type: 'getApiConfig' }
  // | { type: 'applyCode', code: string }
  else if (message.type === 'requestFiles') {
    // get contents of all file paths
    const files = await Promise.all(
      message.filepaths.map(async (filepath) => ({
        filepath, content: await readFileContentOfUri(filepath)
      }))
    );
    // send contents to webview
    webview.postMessage({ type: 'files', files } as WebviewMessage);
  }
  else if (message.type === 'getApiConfig') {
    const apiConfig = getApiConfig();
    console.log('Api config:', JSON.stringify(apiConfig));
    // Sidebar.tsx: if (message.type === "apiConfig")
    webview.postMessage({ type: 'apiConfig', apiConfig } as WebviewMessage);
  }
  else if (message.type === 'applyCode') {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      // vscode.window.showInformationMessage('No active editor!');
      // return;
      editor = await createNewUntitledFile();
    }
    if (editor) {
      const oldContents = await readFileContentOfUri(editor.document.uri);
      const suggestedEdits = getDiffedLines(oldContents, message.code);
      await approvalCodeLensProvider.addNewApprovals(editor, suggestedEdits);
    }
  }
  ////////////////////////////// fulled-chat: end
  else {
    console.log(`not implemented`, message);
  }
}
