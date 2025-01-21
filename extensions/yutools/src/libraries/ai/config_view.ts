import * as vscode from 'vscode';
import { SettingsManager } from './/config';

export function showSettingsPanel(context: vscode.ExtensionContext, settingsManager: SettingsManager) {
  const panel = vscode.window.createWebviewPanel(
    'settingsPanel',
    'LLM Settings',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  panel.webview.html = getWebviewContent(settingsManager);
}

function getWebviewContent(settingsManager: SettingsManager): string {
  const providers = settingsManager.getProviders();
  const rows = providers.map(provider => {
    const settings = settingsManager.getSettings(provider);
    const config = settings?.getConfig();
    return `
          <tr>
            <td>${provider}</td>
            <td>${config?.model || 'N/A'}</td>
            <td>${config?.temperature || 'N/A'}</td>
            <td>${config?.maxTokens || 'N/A'}</td>
            <td>${config?.visionModel || 'N/A'}</td>
            <td>${config?.imageGenerationModel || 'N/A'}</td>
          </tr>
        `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LLM Settings</title>
    <style>
      body {
        background: linear-gradient(135deg, #1e1e2f, #2a2a40);
        color: #fff;
        font-family: "Arial", sans-serif;
        margin: 0;
        padding: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th,
      td {
        padding: 15px;
        text-align: left;
        border-bottom: 1px solid #444;
      }
      th {
        background-color: #333;
        color: #00ffcc;
      }
      tr:hover {
        background-color: #444;
      }
      .neon {
        text-shadow: 0 0 5px #00ffcc, 0 0 10px #00ffcc, 0 0 20px #00ffcc;
      }
      .glass {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="glass">
      <h1 class="neon">LLM Settings</h1>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Model</th>
            <th>Temperature</th>
            <th>Max Tokens</th>
            <th>Vision Model</th>
            <th>Image Generation Model</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  </body>
</html>
    `;
}


export function register_llm_config_commands(context: vscode.ExtensionContext) {
  const settingsManager = new SettingsManager();

  let disposable = vscode.commands.registerCommand('yutools.llm.config.showSettingsPanel', () => {
    showSettingsPanel(context, settingsManager);
  });

  context.subscriptions.push(disposable);
}
