import * as vscode from 'vscode';
import { selectFilesForBookmark } from './bookmark-redis/selectFilesForBookmark';
import { removeFromBookmark } from './bookmark-redis/removeFromBookmark';
import { addFolderToBookmark } from './bookmark-redis/addFolderToBookmark';
import { addFileToBookmarkUsingDialog } from './bookmark-redis/addFileToBookmarkUsingDialog';
import { addFolderToBookmarkUsingDialog } from './bookmark-redis/addFolderToBookmarkUsingDialog';
import { openTerminalInBookmarkedFolder } from './bookmark-redis/openTerminalInBookmarkedFolder';
import { viewBookmark } from './bookmark-redis/viewBookmark';
import { addToBookmark } from './bookmark-redis/addToBookmark';
import { viewFolderBookmark } from './bookmark-redis/viewFolderBookmark';
import { removeFolderFromBookmark } from './bookmark-redis/removeFolderFromBookmark';
import { addFolderToBookmarkFromExplorer } from './bookmark-redis/addFolderToBookmarkFromExplorer';
import { openTerminalAndRunCommand } from './bookmark-redis/openTerminalAndRunCommand';
import { openVSCodeInBookmarkedFolder } from './bookmark-redis/openVSCodeInBookmarkedFolder';
// npm install redis
// kita coba npm install redis && npm i -D @types/redis
// import { createClient } from 'redis';
// import { getConfigValue } from '@/configs';
// import { logger } from '@/yubantu/extension/logger';

export function register_bookmark_redis_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(selectFilesForBookmark);
  context.subscriptions.push(addToBookmark(context));
  context.subscriptions.push(viewBookmark(context));
  context.subscriptions.push(removeFromBookmark(context));

  context.subscriptions.push(addFolderToBookmark(context));
  context.subscriptions.push(viewFolderBookmark(context));
  context.subscriptions.push(removeFolderFromBookmark(context));
  context.subscriptions.push(addFolderToBookmarkFromExplorer(context));
  context.subscriptions.push(openTerminalInBookmarkedFolder);
  context.subscriptions.push(openVSCodeInBookmarkedFolder);
  context.subscriptions.push(openTerminalAndRunCommand);

  context.subscriptions.push(addFileToBookmarkUsingDialog(context), addFolderToBookmarkUsingDialog(context));
}
