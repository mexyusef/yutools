import { getNonce } from '@/utils';
import * as vscode from 'vscode';
// import { getNonce } from '../../utils';

let activeWebviewPanel: vscode.WebviewPanel | null = null;

function getWebviewContent(url: string, title: string, iframe_nonce: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src http://localhost:* vscode-webview:; script-src 'nonce-${iframe_nonce}'; style-src 'unsafe-inline';">

  <title>${title}</title>
</head>
<body>
  <iframe nonce="${iframe_nonce}" src="${url}" frameborder="0" style="width: 100%; height: 100vh;" sandbox="allow-scripts allow-same-origin"></iframe>
</body>
</html>`;
}

// <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src http://localhost:*; script-src 'nonce-${iframe_nonce}'; style-src 'unsafe-inline';">
// <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src http://localhost:* vscode-webview:; script-src 'nonce-${iframe_nonce}'; style-src 'unsafe-inline';">
// <iframe nonce="${iframe_nonce}" src="${url}" frameborder="0" style="width: 100%; height: 100vh;"></iframe>
// <iframe nonce="${iframe_nonce}" src="${url}" frameborder="0" style="width: 100%; height: 100vh;" sandbox="allow-scripts allow-same-origin"></iframe>


// dipanggil jika server sudah serve
// createWebview(title, `http://localhost:${PORT}`);
export function createWebview(title: string, url: string) {

    if (activeWebviewPanel) {
        activeWebviewPanel.dispose();
    }

    activeWebviewPanel = vscode.window.createWebviewPanel(
        "livePreview",
        title,
        // vscode.ViewColumn.One,
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    activeWebviewPanel.webview.html = getWebviewContent(url, title, getNonce());

    // Handle disposal of the panel
    activeWebviewPanel.onDidDispose(() => {
        activeWebviewPanel = null;
    }, null);
}
