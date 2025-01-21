import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { isImageFile, isImageURL } from '@/handlers/commands/vendor';
import { logger } from '@/yubantu/extension/logger';

function getFilePath(key: string): string {
  // Resolve the file path based on the key
  // const userProfile = process.env.USERPROFILE || process.env.HOME || '';
  // return path.join(userProfile, `${key}.md`);
  return path.join(os.homedir(), `${key}.md`);
}

function readMarkdownFile(filePath: string): string | null {
  try {
    // Read the file content synchronously
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// let currentTooltipSize = 500;
// const tooltipSizes = [300, 500, 750, 1000, 'no-scale'];
// let currentTooltipSize: number | 'no-scale' = 500;
let currentTooltipSize: number | 'no-scale' = 1000;
// let currentTooltipSize: number | 'no-scale' = 'no-scale';
const tooltipSizes: Array<number | 'no-scale'> = [300, 500, 750, 1000, 'no-scale'];


export function imageHover(
  document: vscode.TextDocument,
  position: vscode.Position
): vscode.ProviderResult<vscode.Hover> {

  const line = document.lineAt(position.line).text.trim();

  // Check for the pattern "fmus_hover_key:<filename>"
  // coba: fmus_hover_key:terminal-commands
  const fmusHoverPattern = /fmus_hover_key:(\w+)/i;
  const fmusMatch = fmusHoverPattern.exec(line);
  if (fmusMatch) {
    const filename = fmusMatch[1]; // e.g., "git"
    const filePath = getFilePath(filename);
    logger.log(`HOVER baca file: ${filePath}`);
    const hoverContent = readMarkdownFile(filePath);
    if (hoverContent) {
      const md = new vscode.MarkdownString(hoverContent);
      md.isTrusted = true;
      return new vscode.Hover(md);
    }
  }
  // // Check for the pattern "fmus_hover<digit>"
  // const fmusHoverPattern = /fmus_hover_key\d+/gi;
  // const fmusMatch = fmusHoverPattern.exec(line);
  // if (fmusMatch) {
  //   const key = fmusMatch[0]; // e.g., "fmus_hover1"
  //   const filePath = getFilePath(key);
  //   logger.log(`HOVER baca file: ${filePath}`);
  //   const hoverContent = readMarkdownFile(filePath);
  //   logger.log(`HOVER baca content: ${hoverContent}`);
  //   if (hoverContent) {
  //     const md = new vscode.MarkdownString(hoverContent);
  //     md.isTrusted = true;
  //     return new vscode.Hover(md);
  //   }
  // }
  // Regular expression to match image paths and URLs
  const imagePathPattern = /(?:[a-zA-Z]:\\|\\\\[a-zA-Z0-9_.$-]+\\[a-zA-Z0-9_.$-]+\\)?(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]+\.(?:png|jpe?g|gif|bmp|svg)/gi;
  const urlPattern = /(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi;

  let match;
  while ((match = imagePathPattern.exec(line)) !== null) {
    const imgPath = match[0];

    if (fs.existsSync(imgPath) && isImageFile(imgPath)) {
      const imgUri = vscode.Uri.file(imgPath).toString();
      const sizeLinks = tooltipSizes.map(size => {
        const label = size === 'no-scale' ? 'No Scale' : `${size}px`;
        const boldLabel = size === currentTooltipSize ? `**${label}**` : label;
        return `[${boldLabel}](command:extension.resizeImage?${encodeURIComponent(JSON.stringify({ imgPath, size }))})`;
      }).join(' ');

      const hoverContent = [
        '# Image File',
        '',
        `[Open Image](command:vscode.open?${encodeURIComponent(JSON.stringify(imgPath))})`,
        '',
        sizeLinks,
        '',
        currentTooltipSize === 'no-scale' ? `![Image](${imgUri})` : `![Image](${imgUri}|width=${currentTooltipSize}px)`
      ].join('\n');

      // const md = new vscode.MarkdownString(hoverContent, true);
      const md = new vscode.MarkdownString(hoverContent);
      md.isTrusted = true;
      return new vscode.Hover(md);
    }
  }

  while ((match = urlPattern.exec(line)) !== null) {
    const url = match[0];
    // const hoverContent = [
    // 	'# URL',
    // 	'',
    // 	`[Open URL](${url})`
    // ].join('\n');

    // const md = new vscode.MarkdownString(hoverContent, true);
    // md.isTrusted = true;
    // return new vscode.Hover(md);

    // Check if the URL ends with an image file extension
    if (isImageURL(url)) {
      const sizeLinks = tooltipSizes.map(size => {
        const label = size === 'no-scale' ? 'No Scale' : `${size}px`;
        const boldLabel = size === currentTooltipSize ? `**${label}**` : label;
        return `[${boldLabel}](command:extension.resizeImage?${encodeURIComponent(JSON.stringify({ imgPath: url, size }))})`;
      }).join(' ');

      const hoverContent = [
        '# Image URL',
        '',
        `[Open Image](${url})`,
        '',
        sizeLinks,
        '',
        currentTooltipSize === 'no-scale' ? `![Image](${url})` : `![Image](${url}|width=${currentTooltipSize}px)`
      ].join('\n');

      // const md = new vscode.MarkdownString(hoverContent, true);
      const md = new vscode.MarkdownString(hoverContent);
      md.isTrusted = true;
      return new vscode.Hover(md);
    }
  }

  // const config = vscode.workspace.getConfiguration('fmus_hover');
  // logger.log(`config adalah: `, JSON.stringify(config));
  // // Check each key in the configuration
  // for (const key in config) {
  //   if (config[key] && line.includes(config[key])) {
  //     const filePath = getFilePath(key);
  //     logger.log(`HOVER baca file: ${filePath}`);
  //     const hoverContent = readMarkdownFile(filePath);
  //     logger.log(`HOVER baca content: ${hoverContent}`);
  //     if (hoverContent) {
  //       const md = new vscode.MarkdownString(hoverContent);
  //       md.isTrusted = true;
  //       return new vscode.Hover(md);
  //     }
  //   }
  // }

  // No valid image path or URL found in the line
  return null;
}
