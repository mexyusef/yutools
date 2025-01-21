import * as vscode from "vscode";
import fs from 'fs';
import path from 'path';
import os from "os";

export interface LLMProviderKey {
  name: string; // Required
  key: string;  // Required
  settings?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  baseUrl?: string;
  model?: string;
  uses?: number;
}

type LLMProviderKeys = LLMProviderKey[];

type LLMProviderKeyOrNull = LLMProviderKey | null;

type LLMProviderKeysOrNull = LLMProviderKeys | null;


// Example usage
const LLM_PROVIDER_KEYS: LLMProviderKeys = [
  {
    settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
    baseUrl: "https://api.x.ai/v1",
    model: "grok-beta",
    uses: 0,
    name: "key01",
    key: "xai-1",
  },
];

export function loadKeysFromSettings(configName: string)
: 
	// typeof LLM_PROVIDER_KEYS | null 
	// LLMProviderKeys | null
	LLMProviderKeysOrNull
{
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

// vs %userprofile%\llm_provider_keys.json
const CONFIG_FILE_PATH = path.join(os.homedir(), "llm_provider_keys.json");
export function loadKeysFromFile(): typeof LLM_PROVIDER_KEYS | null {
	try {
			if (fs.existsSync(CONFIG_FILE_PATH)) {
					const fileContent = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
					return JSON.parse(fileContent);
			}
	} catch (err) {
			console.error("Error reading keys from file:", err);
	}
	return null;
}

// const USAGE_FILE_PATH = path.resolve(__dirname, 'keyUsage.json');
const USAGE_FILE_PATH = path.join(os.homedir(), 'keyUsage.json');
export function loadUsageData() {
	if (fs.existsSync(USAGE_FILE_PATH)) {
		return JSON.parse(fs.readFileSync(USAGE_FILE_PATH, 'utf-8'));
	}
	return {};
}

export function saveUsageData(usageData: Record<string, number>) {
	fs.writeFileSync(USAGE_FILE_PATH, JSON.stringify(usageData, null, 2));
}
