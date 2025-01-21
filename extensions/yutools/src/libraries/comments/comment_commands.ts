import * as vscode from 'vscode';
import { listCommentsInActiveFile, removeAllCommentsInActiveFile, removeAllCommentsInActiveFileOmitLines } from './CommentUtils';

export function register_comment_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(

    vscode.commands.registerCommand('yutools.comments.removeAllCommentsInActiveFile', async () => {
      await removeAllCommentsInActiveFile();
    }),

    vscode.commands.registerCommand('yutools.comments.removeAllCommentsInActiveFileOmitLines', async () => {
      await removeAllCommentsInActiveFileOmitLines();
    }),

    vscode.commands.registerCommand('yutools.comments.listCommentsInActiveFile', async () => {
      await listCommentsInActiveFile();
    }),

  );
}

