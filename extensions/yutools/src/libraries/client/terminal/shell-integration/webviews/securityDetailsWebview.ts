import * as vscode from 'vscode';
import { BaseWebview } from './baseWebview';
import { SecurityIssue } from '../types';

export class SecurityDetailsWebview extends BaseWebview {
  private readonly issues: SecurityIssue[];

  constructor(extensionUri: vscode.Uri, issues: SecurityIssue[]) {
      super('securityDetails', 'Security Issues', extensionUri);
      this.issues = issues;
      this.updateContent();
  }

  protected getHtmlContent(): string {
      const styleUri = this.getWebviewUri('styles.css');
      const scriptUri = this.getWebviewUri('security.js');

      return `
          <!DOCTYPE html>
          <html>
          <head>
              <link rel="stylesheet" href="${styleUri}">
              <script src="${scriptUri}"></script>
          </head>
          <body>
              <div class="container">
                  <h1>Security Issues</h1>
                  <div class="issues-list">
                      ${this.renderIssues()}
                  </div>
                  <div class="actions">
                      <button onclick="fixAll()">Fix All Issues</button>
                      <button onclick="ignore()">Ignore</button>
                  </div>
              </div>
          </body>
          </html>
      `;
  }

  private renderIssues(): string {
      return this.issues.map(issue => `
          <div class="issue-card ${issue.severity}">
              <h3>${issue.package} @ ${issue.version}</h3>
              <p>${issue.description}</p>
              <div class="recommendations">
                  ${this.renderRecommendations(issue.recommendations)}
              </div>
          </div>
      `).join('');
  }

  private renderRecommendations(recommendations: string[]): string {
      return recommendations.map(rec => `<li>${rec}</li>`).join('');
  }

  protected handleMessage(message: any): void {
      switch (message.command) {
          case 'fixIssue':
              this.fixIssue(message.issueId);
              break;
          case 'ignoreIssue':
              this.ignoreIssue(message.issueId);
              break;
      }
  }

  private async fixIssue(issueId: string): Promise<void> {
      // Implementation for fixing security issues
  }

  private async ignoreIssue(issueId: string): Promise<void> {
      // Implementation for ignoring security issues
  }
}
