import * as vscode from 'vscode';
import { extension_name } from './constants';

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
 * @returns - A promise that resolves when the value is set.
 */
export async function setConfigValue<T>(key: string, value: T): Promise<void> {
	const config = vscode.workspace.getConfiguration(extension_name);
	await config.update(key, value, true); // The 'true' argument means to persist the setting globally.
}

