import * as vscode from 'vscode';
import { hidden_prompt_prefix, hidden_prompt_suffix, extension_name } from '../constants';

const configuration_group = extension_name;

/**
 * Gets the hiddenPromptPrefix from the settings.
 */
export function getHiddenPromptPrefix(reset: boolean = false): string {
	const default_value = hidden_prompt_prefix;
	return reset ? default_value : vscode.workspace.getConfiguration(configuration_group).get<string>('hiddenPromptPrefix', default_value);
}

/**
 * Gets the hiddenPromptSuffix from the settings.
 */
export function getHiddenPromptSuffix(reset: boolean = false): string {
	const default_value = hidden_prompt_suffix;
	return reset ? default_value : vscode.workspace.getConfiguration(configuration_group).get<string>('hiddenPromptSuffix', default_value);
}

/**
 * Sets the hiddenPromptPrefix in the settings.
 * @param value The new value for hiddenPromptPrefix
 */
export async function setHiddenPromptPrefix(value: string): Promise<void> {
	await vscode.workspace.getConfiguration(configuration_group).update('hiddenPromptPrefix', value, vscode.ConfigurationTarget.Global);
}

/**
 * Sets the hiddenPromptSuffix in the settings.
 * @param value The new value for hiddenPromptSuffix
 */
export async function setHiddenPromptSuffix(value: string): Promise<void> {
	await vscode.workspace.getConfiguration(configuration_group).update('hiddenPromptSuffix', value, vscode.ConfigurationTarget.Global);
}

