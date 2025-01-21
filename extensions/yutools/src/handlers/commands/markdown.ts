import * as vscode from 'vscode';
import * as fs from 'fs';
// import * as path from 'path';
import { marked } from 'marked';
import { getConfigValue } from '@/configs';
import { DEFAULT_MARKDOWN_FILE_PATH, extension_name } from '@/constants';
import { openMarkdownFile } from '../markdownutils';


// "contributes": {
//   "configuration": {
//     "type": "object",
//     "properties": {
//       "fulled.helpFilePath": {
//         "type": "string",
//         "default": "C:\\ai\\fulled\\extensions\\fulled\\src\\docs\\BANTUAN.md",
//         "description": "Path to the help file."
//       },
//       "fulled.currentWorkingDirectory": {
//         "type": "string",
//         "default": "c:\\project",
//         "description": "Current working directory."
//       }
//     }
//   }
// }
const show_markdown_help = vscode.commands.registerCommand(
  `${extension_name}.show_markdown_help`,
  () => {
    const panel = vscode.window.createWebviewPanel(
      'help',
      'Help',
      // vscode.ViewColumn.One,
      vscode.ViewColumn.Beside,
      {}
    );

    // Read the Markdown file
    const helpFilePath: string = getConfigValue<string>('helpFilePath', DEFAULT_MARKDOWN_FILE_PATH);
    // const markdownFilePath = path.join(context.extensionPath, helpFilePath);
    const markdownFilePath = helpFilePath;
    fs.readFile(markdownFilePath, 'utf-8', (err, data) => {
      if (err) {
        vscode.window.showErrorMessage('Error reading help file.');
        return;
      }

      // Convert Markdown to HTML
      const htmlContent = marked(data);

      // Set the HTML content for the webview
      panel.webview.html = getWebviewContent(htmlContent as string);
    });
  }
);

function getWebviewContent(markdownHtml: string) {
	return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Help</title>
    </head>
    <body>
      <div>${markdownHtml}</div>
    </body>
  </html>`;
}

const edit_markdown_help = vscode.commands.registerCommand(
  `${extension_name}.edit_markdown_help`,
  async () => {
    const helpFilePath = getConfigValue('helpFilePath', DEFAULT_MARKDOWN_FILE_PATH);
    await openMarkdownFile(helpFilePath);
  }
);

export function register_markdown_menu(context: vscode.ExtensionContext) {
  context.subscriptions.push(show_markdown_help);
  context.subscriptions.push(edit_markdown_help);
}