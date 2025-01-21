import * as vscode from 'vscode';
import { analyzeImageFileCommand } from './analyzeImageFileCommand';
import { analyzeImageUrlCommand } from './analyzeImageUrlCommand';
import { analyzeClipboardImageCommand } from './analyzeClipboardImageCommand';
// import { toolUseWithImageCommand } from './toolUseWithImageCommand';

// called by C:\ai\yuagent\extensions\yutools\src\libraries\ai\groq\index.ts
export function register_groq_vision_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    analyzeImageFileCommand, // yutools.multimodal.groqVision.analyzeImageFile
    analyzeImageUrlCommand, // yutools.multimodal.groqVision.analyzeImageUrl
    analyzeClipboardImageCommand, // yutools.multimodal.groqVision.analyzeClipboardImage
  );
  // context.subscriptions.push(toolUseWithImageCommand);
}
