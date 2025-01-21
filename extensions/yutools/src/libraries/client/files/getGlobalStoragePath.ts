import * as path from 'path';
import { ExtensionContext, Uri } from 'vscode';

/**
 * Generates a file path in the extension's global storage directory.
 * @param context - The extension context.
 * @param fileName - The name of the file.
 * @returns The full file path.
 */
export function getGlobalStoragePath(context: ExtensionContext, fileName: string): string {
    return path.join(context.globalStorageUri.fsPath, fileName);
}