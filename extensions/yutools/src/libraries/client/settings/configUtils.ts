import * as vscode from 'vscode';
import * as path from 'path';
import { extension_name } from '@/constants';

/**
 * Gets a configuration value from the VSCode settings.
 * @param key - The configuration key to retrieve.
 * @param defaultValue - The default value if the key is not found.
 * @returns - The configuration value.
 */
export function getConfigValue<T>(key: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration(extension_name);
    return config.get<T>(key, defaultValue) as T;
}

/**
 * Sets a configuration value in the VSCode settings.
 * @param key - The configuration key to set.
 * @param value - The value to set.
 * @param isGlobal - Whether to save the setting globally (default is true).
 * @returns - A promise that resolves when the value is set.
 */
export async function setConfigValue<T>(key: string, value: T, isGlobal: boolean = true): Promise<void> {
    const config = vscode.workspace.getConfiguration(extension_name);
    await config.update(key, value, isGlobal);
}

/**
 * Get the directory where VSCode was invoked.
 * If a folder is opened as a workspace, it returns the workspace folder path.
 * If a file is opened directly, it returns the parent directory of that file.
 */
export function getInvokedDirectory(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders && workspaceFolders.length > 0) {
        return workspaceFolders[0].uri.fsPath;
    }

    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
        const documentUri = activeTextEditor.document.uri;
        return path.dirname(documentUri.fsPath);
    }

    return undefined;
}

/**
 * Convenience function to get the current working directory.
 * It first tries to retrieve the value from settings, and falls back to the invoked directory.
 * @returns - The current working directory as a string.
 */
export function getCurrentWorkingDirectory(): string {
    const defaultCwd = getInvokedDirectory() || '';
    return getConfigValue<string>('currentWorkingDirectory', defaultCwd);
}

/**
 * Convenience function to set the current working directory.
 * @param value - The directory path to set as the current working directory.
 * @param isGlobal - Whether to save the setting globally (default is true).
 */
export async function setCurrentWorkingDirectory(value: string, isGlobal: boolean = true): Promise<void> {
    await setConfigValue<string>('currentWorkingDirectory', value, isGlobal);
}

/**
 * Get a string configuration value from VSCode settings.
 * @param key - The configuration key to retrieve.
 * @param defaultValue - The default string value if the key is not found.
 * @returns - The configuration value as a string.
 */
export function getStringConfig(key: string, defaultValue: string = ''): string {
    return getConfigValue<string>(key, defaultValue);
}

/**
 * Set a string configuration value in VSCode settings.
 * @param key - The configuration key to set.
 * @param value - The string value to set.
 * @param isGlobal - Whether to save the setting globally (default is true).
 */
export async function setStringConfig(key: string, value: string, isGlobal: boolean = true): Promise<void> {
    await setConfigValue<string>(key, value, isGlobal);
}

/**
 * Get a boolean configuration value from VSCode settings.
 * @param key - The configuration key to retrieve.
 * @param defaultValue - The default boolean value if the key is not found.
 * @returns - The configuration value as a boolean.
 */
export function getBooleanConfig(key: string, defaultValue: boolean = false): boolean {
    return getConfigValue<boolean>(key, defaultValue);
}

/**
 * Set a boolean configuration value in VSCode settings.
 * @param key - The configuration key to set.
 * @param value - The boolean value to set.
 * @param isGlobal - Whether to save the setting globally (default is true).
 */
export async function setBooleanConfig(key: string, value: boolean, isGlobal: boolean = true): Promise<void> {
    await setConfigValue<boolean>(key, value, isGlobal);
}
