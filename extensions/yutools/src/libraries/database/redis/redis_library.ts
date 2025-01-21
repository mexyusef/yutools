// let redisClient: any = null;

// const connectRedis = vscode.commands.registerCommand('yutools.redis.connect', async () => {
//   const redis = initRedis();
//   if (redis) {
//     vscode.window.showInformationMessage('Connected to Redis successfully.');
//   }
// });

// const disconnectRedis = vscode.commands.registerCommand('yutools.redis.disconnect', async () => {
//   if (global.redisClient) {
//     global.redisClient.quit();
//     global.redisClient = null;
//     vscode.window.showInformationMessage('Disconnected from Redis.');
//   }
// });

import { EditorInserter } from '@/libraries/client/editors/editor_inserter';
import * as vscode from 'vscode';

let redisClient: any = null;

export const initializeRedis = async () => {
  if (redisClient) {
    vscode.window.showInformationMessage('Already connected to Redis.');
    return;
  }
  const connectionString = vscode.workspace.getConfiguration('yutools.databases.redis').get('connectionString', 'redis://localhost:6379');
  try {
    const Redis = require('ioredis');
    redisClient = new Redis(connectionString);
    // redisClient.on('connect', () => {
    //   vscode.window.showInformationMessage('Connected to Redis successfully.');
    // });
    redisClient.on('connect', async () => {
      vscode.window.showInformationMessage('Connected to Redis successfully.');
      // try {
      //   const keys = await redisClient.keys('*');
      //   if (keys.length > 0) {
      //     vscode.window.showQuickPick(keys, { title: 'Keys in Redis' });
      //   } else {
      //     vscode.window.showInformationMessage('No keys found in Redis.');
      //   }
      // } catch (error: any) {
      //   vscode.window.showErrorMessage(`Error fetching keys: ${error.message}`);
      // }
    });
    redisClient.on('error', (error: any) => {
      vscode.window.showErrorMessage(`Redis Error: ${error.message}`);
      redisClient = null;
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to connect to Redis: ${error.message}`);
    redisClient = null;
  }
}

// async function initRedis() {
//   // const host = vscode.workspace.getConfiguration('yutools.databases.redis').get('host', 'localhost');
//   // const port = vscode.workspace.getConfiguration('yutools.databases.redis').get('port', 6379);
//   // const password = vscode.workspace.getConfiguration('yutools.databases.redis').get('password', '');
//   // if (!redisClient) {
//   //   const Redis = require('ioredis');
//   //   redisClient = new Redis({ host, port, password });
//   // }
//   await initializeRedis();
//   return redisClient;
// }

const deactivateRedis = () => {
  if (redisClient) {
    redisClient.quit();
    redisClient = null;
    vscode.window.showInformationMessage('Disconnected from Redis.');
  }
};

// const connectRedis = vscode.commands.registerCommand('yutools.redis.connect', async () => {
//   if (redisClient) {
//     vscode.window.showInformationMessage('Already connected to Redis.');
//     return;
//   }

//   const host = vscode.workspace.getConfiguration('yutools.databases.redis').get('host', 'localhost');
//   const port = vscode.workspace.getConfiguration('yutools.databases.redis').get('port', 6379);
//   const password = vscode.workspace.getConfiguration('yutools.databases.redis').get('password', '');

//   try {
//     const Redis = require('ioredis');
//     redisClient = new Redis({ host, port, password });

//     redisClient.on('connect', () => {
//       vscode.window.showInformationMessage('Connected to Redis successfully.');
//     });

//     redisClient.on('error', (error: any) => {
//       vscode.window.showErrorMessage(`Redis Error: ${error.message}`);
//       redisClient = null; // Clear client reference on error
//     });
//   } catch (error: any) {
//     vscode.window.showErrorMessage(`Failed to connect to Redis: ${error.message}`);
//     redisClient = null; // Ensure client is null if connection fails
//   }
// });
const connectRedis = vscode.commands.registerCommand('yutools.redis.connect', initializeRedis);

export const disconnectRedis = vscode.commands.registerCommand('yutools.redis.disconnect', async () => {
  if (!redisClient) {
    vscode.window.showInformationMessage('No active Redis connection to disconnect.');
    return;
  }

  try {
    await redisClient.quit();
    redisClient = null;
    vscode.window.showInformationMessage('Disconnected from Redis.');
  } catch (error: any) {
    vscode.window.showErrorMessage(`Failed to disconnect from Redis: ${error.message}`);
  }
});

const setRedisHost = vscode.commands.registerCommand('yutools.redis.setHost', async () => {
  const newHost = await vscode.window.showInputBox({ prompt: 'Enter Redis Host' });
  if (newHost) {
    await vscode.workspace.getConfiguration('yutools.databases.redis').update('host', newHost, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Redis Host updated.');
  }
});

const getRedisHost = vscode.commands.registerCommand('yutools.redis.getHost', () => {
  const host = vscode.workspace.getConfiguration('yutools.databases.redis').get('host', '');
  vscode.window.showInformationMessage(`Redis Host: ${host}`);
});

const setRedisPort = vscode.commands.registerCommand('yutools.redis.setPort', async () => {
  const newPort = await vscode.window.showInputBox({ prompt: 'Enter Redis Port' });
  if (newPort) {
    await vscode.workspace.getConfiguration('yutools.databases.redis').update('port', parseInt(newPort, 10), vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Redis Port updated.');
  }
});

const getRedisPort = vscode.commands.registerCommand('yutools.redis.getPort', () => {
  const port = vscode.workspace.getConfiguration('yutools.databases.redis').get('port', '');
  vscode.window.showInformationMessage(`Redis Port: ${port}`);
});

const setRedisPassword = vscode.commands.registerCommand('yutools.redis.setPassword', async () => {
  const newPassword = await vscode.window.showInputBox({ prompt: 'Enter Redis Password', password: true });
  if (newPassword) {
    await vscode.workspace.getConfiguration('yutools.databases.redis').update('password', newPassword, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Redis Password updated.');
  }
});

const getRedisPassword = vscode.commands.registerCommand('yutools.redis.getPassword', () => {
  const password = vscode.workspace.getConfiguration('yutools.databases.redis').get('password', '');
  vscode.window.showInformationMessage(`Redis Password: ${password}`);
});

export const listKeys = vscode.commands.registerCommand('yutools.redis.listKeys', async () => {
  // const redis = initRedis();
  if (!redisClient) await initializeRedis();
  try {
    const keys = await redisClient.keys('*');
    // vscode.window.showQuickPick(keys, { title: 'All Keys in Redis' });
    EditorInserter.insertTextInNewEditor(keys.join("\n"));
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error listing keys: ${error.message}`);
  }
});

export const createKey = vscode.commands.registerCommand('yutools.redis.createKey', async () => {
  if (!redisClient) await initializeRedis();
  const key = await vscode.window.showInputBox({ prompt: 'Enter key name' });
  const value = await vscode.window.showInputBox({ prompt: 'Enter key value' });

  if (key && value) {
    try {
      await redisClient.set(key, value);
      vscode.window.showInformationMessage(`Key "${key}" created.`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error creating key: ${error.message}`);
    }
  }
});

const getKeyValue = vscode.commands.registerCommand('yutools.redis.getKeyValue', async () => {
  if (!redisClient) await initializeRedis();

  const key = await vscode.window.showInputBox({ prompt: 'Enter key name' });
  if (key) {
    try {
      const value = await redisClient.get(key);
      vscode.window.showInformationMessage(`Value of "${key}": ${value}`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error fetching value: ${error.message}`);
    }
  }
});

const deleteKey = vscode.commands.registerCommand('yutools.redis.deleteKey', async () => {
  if (!redisClient) await initializeRedis();

  const key = await vscode.window.showInputBox({ prompt: 'Enter key name to delete' });
  if (key) {
    try {
      await redisClient.del(key);
      vscode.window.showInformationMessage(`Key "${key}" deleted.`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error deleting key: ${error.message}`);
    }
  }
});

export const listSetMembers = vscode.commands.registerCommand('yutools.redis.listSetMembers', async () => {
  if (!redisClient) await initializeRedis();

  const key = await vscode.window.showInputBox({ prompt: 'Enter set key' });
  if (key) {
    try {
      const members = await redisClient.smembers(key);
      vscode.window.showQuickPick(members, { title: 'Members of Set' });
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error listing set members: ${error.message}`);
    }
  }
});

export const addSetMember = vscode.commands.registerCommand('yutools.redis.addSetMember', async () => {
  if (!redisClient) await initializeRedis();

  const key = await vscode.window.showInputBox({ prompt: 'Enter set key' });
  const value = await vscode.window.showInputBox({ prompt: 'Enter value to add' });

  if (key && value) {
    try {
      await redisClient.sadd(key, value);
      vscode.window.showInformationMessage(`Value "${value}" added to set "${key}".`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error adding to set: ${error.message}`);
    }
  }
});

export const setRedisConnectionString = vscode.commands.registerCommand('yutools.redis.setConnectionString', async () => {
  const newConnectionString = await vscode.window.showInputBox({ prompt: 'Enter Redis connection string (e.g., redis://user:pass@host:port)' });
  if (newConnectionString) {
    await vscode.workspace.getConfiguration('yutools.databases.redis').update('connectionString', newConnectionString, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage('Redis connection string updated.');
  }
});

const connectAndTestRedis2 = vscode.commands.registerCommand('yutools.redis.connectAndTest2', async () => {
  await vscode.commands.executeCommand('yutools.redis.connect');
  if (redisClient) {
    try {
      const keys = await redisClient.keys('*');
      vscode.window.showQuickPick(keys, { title: 'Keys in Redis' });
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error listing keys: ${error.message}`);
    }
  }
});

export const connectAndTestRedis = vscode.commands.registerCommand('yutools.redis.connectAndTest', async () => {
  await vscode.commands.executeCommand('yutools.redis.connect');
  if (redisClient) {
    const action = await vscode.window.showQuickPick(['List All Keys', 'Search Keys'], { placeHolder: 'Choose an action' });

    if (action === 'List All Keys') {
      try {
        const keys = await redisClient.keys('*');
        vscode.window.showQuickPick(keys, { title: 'Keys in Redis' });
      } catch (error: any) {
        vscode.window.showErrorMessage(`Error listing keys: ${error.message}`);
      }
    } else if (action === 'Search Keys') {
      await vscode.commands.executeCommand('yutools.redis.searchKeys');
    }
  }
});

const searchKeys = vscode.commands.registerCommand('yutools.redis.searchKeys', async () => {
  if (!redisClient) await initializeRedis();

  // Prompt user for a search pattern
  const pattern = await vscode.window.showInputBox({ prompt: 'Enter key pattern (e.g., user:*, order:*)' });
  if (!pattern) {
    vscode.window.showInformationMessage('Search pattern is required.');
    return;
  }

  try {
    // Fetch keys matching the pattern
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      vscode.window.showQuickPick(keys, { title: `Keys matching "${pattern}"` });
    } else {
      vscode.window.showInformationMessage(`No keys found for pattern "${pattern}".`);
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error searching keys: ${error.message}`);
  }
});

export const searchKeysFast = vscode.commands.registerCommand('yutools.redis.searchKeysFast', async () => {
  if (!redisClient) await initializeRedis();

  const pattern = await vscode.window.showInputBox({ prompt: 'Enter key pattern (e.g., user:*, order:*)' });
  if (!pattern) {
    vscode.window.showInformationMessage('Search pattern is required.');
    return;
  }

  try {
    const keys: string[] = [];
    let cursor = '0';

    do {
      const [newCursor, foundKeys] = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = newCursor;
      keys.push(...foundKeys);
    } while (cursor !== '0');

    if (keys.length > 0) {
      vscode.window.showQuickPick(keys, { title: `Keys matching "${pattern}"` });
    } else {
      vscode.window.showInformationMessage(`No keys found for pattern "${pattern}".`);
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error searching keys: ${error.message}`);
  }
});

export const paginateKeys = vscode.commands.registerCommand('yutools.redis.paginateKeys', async () => {
  if (!redisClient) await initializeRedis();

  const pattern = await vscode.window.showInputBox({ prompt: 'Enter key pattern (e.g., user:*, order:*)' });
  if (!pattern) {
    vscode.window.showInformationMessage('Search pattern is required.');
    return;
  }

  try {
    let cursor = '0';
    let pageCount = 0;

    do {
      // Scan for a batch of keys
      const [newCursor, keys] = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = newCursor;

      // Display the current batch
      if (keys.length > 0) {
        const selectedKey = await vscode.window.showQuickPick(keys, {
          placeHolder: `Page ${pageCount + 1}: Select a key or continue browsing`,
          canPickMany: false,
        });

        if (selectedKey) {
          const value = await redisClient.get(selectedKey);
          vscode.window.showInformationMessage(`Key: ${selectedKey}, Value: ${value}`);
        }
      }

      pageCount++;

      // Ask user if they want to continue
      if (cursor !== '0') {
        const continueBrowsing = await vscode.window.showQuickPick(['Yes', 'No'], {
          placeHolder: 'Continue to next page?',
        });
        if (continueBrowsing === 'No') break;
      }
    } while (cursor !== '0');
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error searching keys: ${error.message}`);
  }
});

const filterKeysByType = vscode.commands.registerCommand('yutools.redis.filterKeysByType', async () => {
  if (!redisClient) await initializeRedis();

  const dataType = await vscode.window.showQuickPick(
    ['string', 'hash', 'list', 'set', 'zset'],
    { placeHolder: 'Select a data type to filter keys' }
  );

  if (!dataType) {
    vscode.window.showInformationMessage('Data type selection is required.');
    return;
  }

  try {
    const keys: string[] = [];
    let cursor = '0';

    do {
      // Scan for keys
      const [newCursor, foundKeys] = await redisClient.scan(cursor, 'COUNT', 100);
      cursor = newCursor;

      // Filter keys by type
      for (const key of foundKeys) {
        const type = await redisClient.type(key);
        if (type === dataType) {
          keys.push(key);
        }
      }
    } while (cursor !== '0');

    if (keys.length > 0) {
      const selectedKey = await vscode.window.showQuickPick(keys, { placeHolder: `Keys of type "${dataType}"` });
      if (selectedKey) {
        vscode.window.showInformationMessage(`Selected key: ${selectedKey}`);
      }
    } else {
      vscode.window.showInformationMessage(`No keys of type "${dataType}" found.`);
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error filtering keys: ${error.message}`);
  }
});

function getWebViewContent(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redis Key Manager</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 10px; }
        #keys { margin-top: 20px; }
        button { margin-right: 5px; }
      </style>
    </head>
    <body>
      <h1>Redis Key Manager</h1>
      <input id="searchPattern" type="text" placeholder="Enter key pattern (e.g., user:*)" />
      <button onclick="searchKeys()">Search</button>
      <button onclick="clearResults()">Clear</button>
      <ul id="keys"></ul>
      <script>
        const vscode = acquireVsCodeApi();

        function searchKeys() {
          const pattern = document.getElementById('searchPattern').value;
          vscode.postMessage({ command: 'searchKeys', pattern });
        }

        function clearResults() {
          document.getElementById('keys').innerHTML = '';
        }

        window.addEventListener('message', (event) => {
          const { keys } = event.data;
          const list = document.getElementById('keys');
          list.innerHTML = keys.map(key => \`<li>\${key}</li>\`).join('');
        });
      </script>
    </body>
    </html>
  `;
}

const openKeyManagerWebView = vscode.commands.registerCommand('yutools.redis.keyManager', async () => {
  const panel = vscode.window.createWebviewPanel(
    'redisKeyManager',
    'Redis Key Manager',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  panel.webview.html = getWebViewContent();

  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.command === 'searchKeys') {
      const { pattern } = message;
      const keys = await redisClient.keys(pattern);
      panel.webview.postMessage({ keys });
    }
  });

});

class RedisKeyProviderOld implements vscode.TreeDataProvider<vscode.TreeItem> {
  async getChildren(): Promise<vscode.TreeItem[]> {
    const keys = await redisClient.keys('*');
    return keys.map((key: string) => new vscode.TreeItem(key));
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }
}

// vscode.window.createTreeView('redisKeysTreeView', {
//   treeDataProvider: new RedisKeyProviderOld(),
// });

// class RedisKeyProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
//   private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | null | undefined> =
//     new vscode.EventEmitter<vscode.TreeItem | null | undefined>();
//   readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | null | undefined> = this._onDidChangeTreeData.event;

//   constructor(private redis: any) { }

//   refresh(): void {
//     this._onDidChangeTreeData.fire();
//   }

//   async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
//     if (!this.redis) {
//       vscode.window.showErrorMessage('Redis is not connected.');
//       return [];
//     }

//     if (!element) {
//       try {
//         const keys = await this.redis.keys('*');
//         return keys.map((key: string) => new vscode.TreeItem(key, vscode.TreeItemCollapsibleState.None));
//       } catch (error: any) {
//         vscode.window.showErrorMessage(`Failed to fetch keys: ${error.message}`);
//         return [];
//       }
//     }

//     return [];
//   }

//   getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
//     return element;
//   }
// }

// let redisKeyProvider: RedisKeyProvider | undefined;

// vscode.commands.registerCommand('yutools.redis.refreshKeys', () => {
//   if (redisKeyProvider) {
//     redisKeyProvider.refresh();
//   }
// });

// vscode.commands.registerCommand('yutools.redis.refreshTree', () => {
//   if (redisKeyProvider) {
//     redisKeyProvider.refresh();
//   }
// });
