import * as vscode from 'vscode';
import axios from 'axios';

import { API_BASE_URL, extension_name } from '@/constants';
import { endpointMapping } from './mapping';
import { ApiResponse, MultiQueriesResponse } from './types';
import { getPromptAndContext, insertTextInEditor } from '@/handlers/commands/vendor';
import { command_with_progressbar, commandItems } from './common';
// import { getCurrentProjectFolder } from './project_commands';
import { callApiFunctionWithoutContext, generalMultiQuery, generalSingleQuery } from './networkquery';
// import { cleanUpPromptFromPrefix } from './strings_commands';
import { commanditems_selector } from './commands/commanditems_selector';
import { commands_misc_selector } from './commands/commands_misc_selector';
import { getCurrentProjectFolder } from './utilities/getCurrentProjectFolder';
import { cleanUpPromptFromPrefix } from './utilities/cleanUpPromptFromPrefix';

// C:\portfolio\fmus-lib\fmus-ts\fmus-vscode\src\extension.ts


// const API_BASE_URL = `http://${HOST_PORT}`;
const run_fmus_url = `${API_BASE_URL}/run_fmus`;
const run_fmus_for_project = `${API_BASE_URL}/run_fmus_for_project`;
const run_ketik_url = `${API_BASE_URL}/run_ketik`;
const run_ketik_for_project = `${API_BASE_URL}/run_ketik_for_project`;

const completion_url = `${API_BASE_URL}/completion`;
const get_invoke_all_url = `${API_BASE_URL}/get_invoke_all`;
const update_invoke_all_url = `${API_BASE_URL}/update_invoke_all`;
const help_url = `${API_BASE_URL}/help`;
const save_pdf_url = `${API_BASE_URL}/save_pdf/`;
const query_pdf_url = `${API_BASE_URL}/query_pdf/`;
const get_active_url = `${API_BASE_URL}/get_active`;
const update_active_url = `${API_BASE_URL}/update_active`;
const get_mode_url = `${API_BASE_URL}/get_mode`;
const update_mode_url = `${API_BASE_URL}/update_mode`;
const OCR_TESSERACT_URL = `${API_BASE_URL}/ocr/tesseract`;
const OCR_OPENAI_URL = `${API_BASE_URL}/ocr/openai`;

const showTimedInformationMessage = (message: string, duration: number) => {
  const infoMessagePromise = vscode.window.showInformationMessage(message);

  // This sets a timeout to resolve the promise after the specified duration
  setTimeout(() => {
    infoMessagePromise.then(() => {
      // Since there's no way to programmatically dismiss the message,
      // we just resolve the promise after the duration
      // Additional logic can be added here if needed
    });
  }, duration);
};

const registerCommandWithApiCall = (
  commandName: string,
  apiUrl: string,
  prefix: string = ""
) => {
  return vscode.commands.registerCommand(
    commandName,
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return "";
      }

      const cursorPosition = editor.selection.start;
      const line = editor.document.lineAt(cursorPosition.line);
      let wordRange: vscode.Range;

      const selection = editor.selection;

      if (!selection.isEmpty) {
        wordRange = new vscode.Range(selection.start, selection.end);
      } else {
        wordRange = new vscode.Range(line.range.start, line.range.end);
      }

      const wordText = editor.document.getText(wordRange);
      const metaWorkspacesFspath = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) || [];
      const metaWorkspacesPath = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.path) || [];
      const metaDocument = {
        filename: editor.document.fileName,
        fsPath: editor.document.uri.fsPath,
        path: editor.document.uri.path,
        language: editor.document.languageId,
      };

      // krn bisa diakses dari codelens yg tambah prefix
      // spt //1 dst, jd hrs bersihkan dulu
      const cleanPrompt = cleanUpPromptFromPrefix(wordText);

      const data = {
        content: prefix + cleanPrompt,
        meta: {
          metaWorkspacesFspath,
          metaWorkspacesPath,
          metaDocument,
          currentProjectFolder: getCurrentProjectFolder(),
        }
      };
      const data_to_send = JSON.stringify(data, null, 2);
      console.log(data_to_send);
      if (apiUrl === run_fmus_url || apiUrl === run_fmus_for_project) {
        // vscode.window.showInformationMessage(`Run FMUS.`);
        showTimedInformationMessage('Run FMUS.', 3000); // 3 seconds timeout
      } else if (apiUrl === run_ketik_url || apiUrl === run_ketik_for_project) {
        // vscode.window.showInformationMessage(`Run Ketik.`);
        showTimedInformationMessage('Run Ketik.', 3000); // 3 seconds timeout
      }

      try {
        const response = await axios.post(apiUrl, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const textToInsert = JSON.stringify(response.data, null, 2);
        editor.edit(editBuilder => {
          editBuilder.insert(editor.selection.active, `\n${textToInsert}`);
          // editBuilder.insert(editor.selection.active, `\n${textToInsert}\n${data_to_send}`);
        });
      } catch (error) {
        vscode.window.showErrorMessage(`${commandName}: No API function found for endpoint ${apiUrl}: ${error}`);
      }
    }
  );
};

// let runFmusCommand = registerCommandWithApiCall(`${extension_name}.runFmus`, run_fmus_url, "fmuslang:");
// let runKetikCommand = registerCommandWithApiCall(`${extension_name}.runKetik`, run_ketik_url);
// let runKetikForProjectCommand = registerCommandWithApiCall(`${extension_name}.run_ketik_for_project`, run_ketik_for_project);
// let runFmusForProjectCommand = registerCommandWithApiCall(`${extension_name}.run_fmus_for_project`, run_fmus_for_project);
// context.subscriptions.push(runFmusCommand, runKetikForProjectCommand, runKetikCommand, runFmusForProjectCommand);
// projectCreatorCommand(context);
// registerExecuteShellCommandInWorkingDirectory(context);
// registerFilesFoldersManipulation(context);
const runFmusCommand = registerCommandWithApiCall(`${extension_name}.runFmus`, run_fmus_url, "fmuslang:");
const runKetikCommand = registerCommandWithApiCall(`${extension_name}.runKetik`, run_ketik_url);
const runKetikForProjectCommand = registerCommandWithApiCall(`${extension_name}.run_ketik_for_project`, run_ketik_for_project);
const runFmusForProjectCommand = registerCommandWithApiCall(`${extension_name}.run_fmus_for_project`, run_fmus_for_project);
// await axios.post(`${API_BASE_URL}/select_misc_command`, { prompt: selectedCommand });

export function register_fmus_vscode_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    runFmusCommand,
    runKetikCommand,
    runKetikForProjectCommand,
    runFmusForProjectCommand,
    commanditems_selector,
    commands_misc_selector,
  );
  // registerExecuteShellCommandInWorkingDirectory(context);
}
