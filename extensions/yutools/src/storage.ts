import * as path from 'path';
import { ExtensionContext } from 'vscode';

let _context: ExtensionContext | undefined;

/**
 * Sets the extension context. This should be called during activation.
 * @param context - The extension context.
 */
export function setStorageContext(context: ExtensionContext): void {
    _context = context;
}

/**
 * Gets the file path in the extension's global storage directory.
 * @param fileName - The name of the file.
 * @returns The full file path.
 * @throws If the context has not been set.
 */
export function getGlobalStoragePath(fileName: string): string {
    if (!_context) {
        throw new Error('Extension context has not been set. Call setContext() first.');
    }
    return path.join(_context.globalStorageUri.fsPath, fileName);
}