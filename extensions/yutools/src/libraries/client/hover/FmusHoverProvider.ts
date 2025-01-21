import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { logger } from '@/yubantu/extension/logger';

export class FmusHoverProvider implements vscode.HoverProvider {
  public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    const lineText = document.lineAt(position.line).text;

    // Get the configuration settings
    const config = vscode.workspace.getConfiguration('yutools.fmus_hover');

    // Check each key in the configuration
    for (const key in config) {
      if (config[key] && lineText.includes(config[key])) {
        const filePath = this.getFilePath(key);
        logger.log(`HOVER baca file: ${filePath}`);
        const hoverContent = this.readMarkdownFile(filePath);
        logger.log(`HOVER baca content: ${hoverContent}`);
        if (hoverContent) {
          const md = new vscode.MarkdownString(hoverContent);
          md.isTrusted = true;
          return new vscode.Hover(md);
        }
      }
    }

    return null;
  }

  private getFilePath(key: string): string {
    // Resolve the file path based on the key
    // const userProfile = process.env.USERPROFILE || process.env.HOME || '';
    // return path.join(userProfile, `${key}.md`);
    return path.join(os.homedir(), `${key}.md`);
  }

  private readMarkdownFile(filePath: string): string | null {
    try {
      // Read the file content synchronously
      const content = fs.readFileSync(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return null;
    }
  }
}