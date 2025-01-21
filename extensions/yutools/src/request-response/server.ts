import * as vscode from 'vscode';
import { RequestResponseHandler } from './requestResponseProtocol';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('myWebview', {
      resolveWebviewView(webviewView) {
        const requestResponseHandler = new RequestResponseHandler(
          (message) => webviewView.webview.postMessage(message), // Send message to webview
          (listener) => webviewView.webview.onDidReceiveMessage(listener) // Listen for messages
        );

        // Handle 'getConfig' requests
        webviewView.webview.onDidReceiveMessage(async (message) => {
          requestResponseHandler.handleServerRequest(
            'getConfig',
            async (payload: { key: string }) => {
              const config = vscode.workspace.getConfiguration();
              return config.get<string>(payload.key); // Fetch the config value
            },
            message
          );
        });
      },
    })
  );
}
