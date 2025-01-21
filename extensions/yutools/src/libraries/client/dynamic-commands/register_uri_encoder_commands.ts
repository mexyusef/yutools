import * as vscode from 'vscode';
import { encodeInsertAndCopy } from './encodeInsertAndCopy';
import { encodeAndInsert } from './encodeAndInsert';
import { encodeAndCopy } from './encodeAndCopy';
import { openDynamicFileCommand } from './openDynamicFileCommand';
import { openTerminalWithArgs } from './openTerminalWithArgs';
import { generateMarkdownLinkForTerminal } from './generateMarkdownLinkForTerminal';
import { generateMarkdownLinkForFile } from './generateMarkdownLinkForFile';
import { openDynamicUrlCommand } from './openDynamicUrlCommand';
import { generateMarkdownLinkForUrl } from './generateMarkdownLinkForUrl';

// C:\Users\usef\terminal-commands.md
export function register_uri_encoder_commands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    encodeAndCopy,
    encodeAndInsert,
    encodeInsertAndCopy,
    openTerminalWithArgs,
    openDynamicFileCommand,
    openDynamicUrlCommand,
    generateMarkdownLinkForTerminal,
    generateMarkdownLinkForFile,
    generateMarkdownLinkForUrl,
  );
}
