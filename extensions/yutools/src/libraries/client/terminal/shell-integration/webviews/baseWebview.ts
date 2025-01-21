import * as vscode from 'vscode';
import { CodePatternAnalyzer } from '../shell-integration/analysisPatterns/codePatternAnalyzer';
import { PackageMigration } from '../shell-integration/migrationHelpers/packageMigration';
import { SecurityIssue } from '../types';
import { SecurityDetailsWebview } from './securityDetailsWebview';

export abstract class BaseWebview {
  protected readonly _panel: vscode.WebviewPanel;
  protected readonly _extensionUri: vscode.Uri;

  constructor(viewType: string, title: string, extensionUri: vscode.Uri) {
    this._panel = vscode.window.createWebviewPanel(
      viewType,
      title,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri]
      }
    );
    this._extensionUri = extensionUri;
    this._panel.webview.html = this.getHtmlContent();
    this.initializeMessageHandling();
  }

  protected abstract getHtmlContent(): string;
  protected abstract handleMessage(message: any): void;

  private initializeMessageHandling(): void {
    this._panel.webview.onDidReceiveMessage(
      this.handleMessage.bind(this),
      undefined,
      []
    );
  }

  protected getWebviewUri(filePath: string): vscode.Uri {
    return this._panel.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', filePath)
    );
  }
}
