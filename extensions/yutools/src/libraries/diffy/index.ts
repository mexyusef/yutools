import * as vscode from 'vscode';
import { register_clipboard_diff } from './ClipboardDiff';
import { register_easy_diff_commands } from './EasyDiff';

export function register_diff_commands(context: vscode.ExtensionContext) {
  register_clipboard_diff(context);
  register_easy_diff_commands(context);
}
