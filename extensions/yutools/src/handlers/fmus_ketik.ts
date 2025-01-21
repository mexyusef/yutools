import * as vscode from 'vscode';
import { exec } from 'child_process';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

// 1. Function to run FMUS code at a specific directory
export async function run_fmus_at_specific_dir(text: string, dir: string): Promise<void> {
  const apiUrl = `${API_BASE_URL}/run_fmus`;

  // C:\Users\usef\work\sidoarjo\schnell\app\llmutils\servers\types.py
  const data = {
    content: 'fmuslang:' + text,
    meta: {
      metaWorkspacesFspath: [dir],
      metaWorkspacesPath: [dir],
      currentProjectFolder: dir,
      metaDocument: {
        fsPath: dir, // cuma ini dipake

        filename: dir,
        path: dir,
        language: 'javascript',
      },
    }
  };
  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    vscode.window.showInformationMessage(JSON.stringify(response.data, null, 2));
    // ini gak perlu
    // insertTextToEditor(response.data);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error running FMUS: ${error.message}`);
  }
}

// 2. Function to run Ketik text at a specific directory
export async function run_ketik_at_specific_dir(text: string, dir: string): Promise<void> {
  const apiUrl = `${API_BASE_URL}/run_ketik`;
  // meta_document_fs_path = request.meta.metaDocument.fsPath
  // if not meta_document_fs_path:
  //     meta_document_fs_path = os.getcwd()
  const data = {
    content: text,
    meta: {
      metaWorkspacesFspath: [dir],
      metaWorkspacesPath: [dir],
      currentProjectFolder: dir,
      metaDocument: {
        fsPath: dir, // cuma ini dipake

        filename: dir,
        path: dir,
        language: 'javascript',
      },
    }
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    vscode.window.showInformationMessage('Ketik Text Executed.');
    // insertTextToEditor(response.data);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error running Ketik: ${error.message}`);
  }
}

// 3. Function to run a shell command at a specific directory
export function run_shellcmd_at_specific_dir(text: string, dir: string, notify?: boolean): void {
  exec(text, { cwd: dir }, (error, stdout, stderr) => {
    if (!notify) return;
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }
    editor.edit(editBuilder => {
      const position = editor.selection.active;
      if (error) {
        editBuilder.insert(position, `Error: ${stderr}`);
      } else {
        editBuilder.insert(position, stdout);
      }
    });
  });
}

// Helper function to insert text into the editor
export function insertTextToEditor(text: string): void {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.edit(editBuilder => {
      const position = editor.selection.active;
      editBuilder.insert(position, `\n${JSON.stringify(text, null, 2)}\n`);
    });
  }
}
