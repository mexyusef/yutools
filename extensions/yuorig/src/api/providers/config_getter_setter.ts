import * as vscode from "vscode";

const LLM_PROVIDER_KEYS = [
	{ 
    settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
    baseUrl: "https://api.x.ai/v1",
    model: "grok-beta",
    uses: 0,
    name: "key01",
    key: "xai-1",
  },
];

export function loadKeysFromSettings(configName: string, ): typeof LLM_PROVIDER_KEYS | null {
	try {
			const config = vscode.workspace.getConfiguration();
			const keys = config.get(configName);
			if (keys && Array.isArray(keys)) {
					return keys as typeof LLM_PROVIDER_KEYS;
			}
	} catch (err) {
			console.error("Error reading keys from settings:", err);
	}
	return null;
}

export function saveKeysToSettings(configName: string, keys: typeof LLM_PROVIDER_KEYS): void {
	try {
			const config = vscode.workspace.getConfiguration();
			config.update(configName, keys, vscode.ConfigurationTarget.Global);
	} catch (err) {
			console.error("Error saving keys to settings:", err);
	}
}