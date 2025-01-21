import * as vscode from 'vscode';

export class RedisKeyProvider implements vscode.TreeDataProvider<RedisTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<RedisTreeItem | null | undefined> =
    new vscode.EventEmitter<RedisTreeItem | null | undefined>();
  readonly onDidChangeTreeData: vscode.Event<RedisTreeItem | null | undefined> =
    this._onDidChangeTreeData.event;

  private redis: any;
  private searchPattern: string = '*'; // Default: Fetch all keys

  constructor(redis: any) {
    this.redis = redis;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(null); // Fire event to refresh the entire tree
  }

  search(pattern: string): void {
    this.searchPattern = pattern;
    this.refresh();
  }

  async getChildren(element?: RedisTreeItem): Promise<RedisTreeItem[]> {
    if (!this.redis) {
      vscode.window.showErrorMessage('Redis is not connected.');
      return [];
    }

    if (!element) {
      // Top-level: Fetch prefixes (simulating hierarchy)
      return this.fetchPrefixes();
    } else if (element.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
      // Fetch keys for the selected prefix
      return this.fetchKeys(element.label);
    }

    return [];
  }

  getTreeItem(element: RedisTreeItem): vscode.TreeItem {
    return element;
  }

  private async fetchPrefixes(): Promise<RedisTreeItem[]> {
    try {
      const cursor = '0';
      const [_, keys] = await this.redis.scan(cursor, 'MATCH', `${this.searchPattern}`, 'COUNT', 100);
  
      const prefixes = new Set<string>(
        keys.map((key: string) => key.split(':')[0]) // Ensure prefixes are strings
      );
  
      return Array.from(prefixes).map(
        (prefix: string) =>
          new RedisTreeItem(prefix, vscode.TreeItemCollapsibleState.Collapsed, 'prefix')
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to fetch prefixes: ${error.message}`);
      return [];
    }
  }  

  private async fetchKeys(prefix: string): Promise<RedisTreeItem[]> {
    try {
      const cursor = '0';
      const [_, keys] = await this.redis.scan(cursor, 'MATCH', `${prefix}:*`, 'COUNT', 100);

      return keys.map((key: string) => new RedisTreeItem(key, vscode.TreeItemCollapsibleState.None, 'key'));
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to fetch keys for prefix "${prefix}": ${error.message}`);
      return [];
    }
  }
}

class RedisTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string
  ) {
    super(label, collapsibleState);
    this.contextValue = contextValue;
  }
}

export let redisKeyProvider: RedisKeyProvider | undefined;

export const refreshKeys = vscode.commands.registerCommand('yutools.redis.refreshKeys', () => {
  if (redisKeyProvider) {
    redisKeyProvider.refresh();
  }
});

export const refreshTree = vscode.commands.registerCommand('yutools.redis.refreshTree', () => {
  if (redisKeyProvider) {
    redisKeyProvider.refresh();
  }
});
