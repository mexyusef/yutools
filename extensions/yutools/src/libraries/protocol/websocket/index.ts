import * as vscode from 'vscode';

class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private activeConnection: string | null = null;

  createConnection(url: string): void {
    if (this.connections.has(url)) {
      vscode.window.showWarningMessage(`WebSocket connection to ${url} already exists.`);
      return;
    }

    const ws = new WebSocket(url);

    ws.onopen = () => {
      vscode.window.showInformationMessage(`Connected to WebSocket at ${url}`);
    };

    ws.onmessage = (event) => {
      vscode.window.showInformationMessage(`Message received: ${event.data}`);
    };

    ws.onclose = () => {
      vscode.window.showWarningMessage(`WebSocket at ${url} closed.`);
    };

    ws.onerror = (event) => {
      vscode.window.showErrorMessage(`WebSocket error on ${url}: ${event}`);
    };

    this.connections.set(url, ws);
    this.activeConnection = url;
  }

  closeConnection(url: string): void {
    const connection = this.connections.get(url);
    if (!connection) {
      vscode.window.showErrorMessage(`No WebSocket connection to ${url}`);
      return;
    }

    connection.close();
    this.connections.delete(url);

    if (this.activeConnection === url) {
      this.activeConnection = null;
    }

    vscode.window.showInformationMessage(`WebSocket connection to ${url} closed.`);
  }

  listConnections(): string[] {
    return Array.from(this.connections.keys());
  }

  switchConnection(url: string): void {
    if (!this.connections.has(url)) {
      vscode.window.showErrorMessage(`No WebSocket connection to ${url}`);
      return;
    }

    this.activeConnection = url;
    vscode.window.showInformationMessage(`Switched active WebSocket connection to ${url}`);
  }

  toggleAutoReconnect(url: string, enable: boolean): void {
    const connection = this.connections.get(url);
    if (!connection) {
      vscode.window.showErrorMessage(`No WebSocket connection to ${url}`);
      return;
    }

    // Example implementation (actual auto-reconnect logic may vary)
    vscode.window.showInformationMessage(
      `${enable ? 'Enabled' : 'Disabled'} auto-reconnect for WebSocket at ${url}`
    );
  }
}

const webSocketManager = new WebSocketManager();

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.websocket.createConnection', async () => {
      const url = await vscode.window.showInputBox({ prompt: 'Enter WebSocket URL' });
      if (url) {
        webSocketManager.createConnection(url);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.websocket.closeConnection', async () => {
      const connections = webSocketManager.listConnections();
      if (connections.length === 0) {
        vscode.window.showWarningMessage('No active WebSocket connections to close.');
        return;
      }

      const url = await vscode.window.showQuickPick(connections, { placeHolder: 'Select a WebSocket to close' });
      if (url) {
        webSocketManager.closeConnection(url);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.websocket.listConnections', () => {
      const connections = webSocketManager.listConnections();
      if (connections.length === 0) {
        vscode.window.showInformationMessage('No active WebSocket connections.');
        return;
      }

      vscode.window.showInformationMessage(`Active WebSocket connections: ${connections.join(', ')}`);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.websocket.switchConnection', async () => {
      const connections = webSocketManager.listConnections();
      if (connections.length === 0) {
        vscode.window.showWarningMessage('No active WebSocket connections to switch.');
        return;
      }

      const url = await vscode.window.showQuickPick(connections, { placeHolder: 'Select a WebSocket to switch to' });
      if (url) {
        webSocketManager.switchConnection(url);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('yutools.websocket.toggleAutoReconnect', async () => {
      const connections = webSocketManager.listConnections();
      if (connections.length === 0) {
        vscode.window.showWarningMessage('No active WebSocket connections to configure auto-reconnect.');
        return;
      }

      const url = await vscode.window.showQuickPick(connections, { placeHolder: 'Select a WebSocket to toggle auto-reconnect' });
      if (url) {
        const enable = await vscode.window.showQuickPick(['Enable', 'Disable'], { placeHolder: 'Enable or disable auto-reconnect' });
        if (enable) {
          webSocketManager.toggleAutoReconnect(url, enable === 'Enable');
        }
      }
    })
  );
}
