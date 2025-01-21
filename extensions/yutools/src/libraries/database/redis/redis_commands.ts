import * as vscode from 'vscode';
import { RedisKeyProvider } from './RedisKeyProvider';
import { initializeRedis } from './redis_library'; // Ensure initRedis initializes the Redis connection properly

let redisKeyProvider: RedisKeyProvider;

export function activate(context: vscode.ExtensionContext) {
  // Initialize Redis Tree View
  redisKeyProvider = new RedisKeyProvider(initializeRedis());
  vscode.window.createTreeView('redisKeysTreeView', {
    treeDataProvider: redisKeyProvider,
  });

  // Register Refresh Command
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.redis.refreshTree', () => {
      redisKeyProvider.refresh();
    })
  );

  // Register Search Command
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.redis.searchKeys', async () => {
      const searchTerm = await vscode.window.showInputBox({ prompt: 'Enter search pattern (e.g., user:*)' });
      if (searchTerm) {
        redisKeyProvider.search(searchTerm);
      }
    })
  );
}
