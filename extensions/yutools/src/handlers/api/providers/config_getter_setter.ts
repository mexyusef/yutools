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

export type LLMMessage = { role: "system" | "user" | "assistant"; content: string };

export type LLMMessageArray = LLMMessage[];

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
// C:\hapus>dir %userprofile%\*.json
// 10/05/2023  12:24 PM                88 tterm.json
// 12/04/2024  09:34 AM             2,326 GOOGLE_GEMINI_API_KEYS.json
// 12/04/2024  11:44 AM             9,902 GROQ_API_KEYS.json
// 12/04/2024  11:44 AM            15,665 HYPERBOLIC_API_KEYS.json
// 12/04/2024  11:44 AM            11,720 SAMBANOVA_API_KEYS.json
// 12/03/2024  03:50 PM            28,346 XAI_API_KEYS.json

const CONFIG_FILE_PATH = path.join(os.homedir(), "XAI_API_KEYS.json");

export function loadKeysFromFile(configFile?: string): LLMProviderKeys | null {
	if (configFile === undefined) {
		configFile = CONFIG_FILE_PATH;
	} else {
		// Check if the configFile is absolute; if not, prefix it with os.homedir()
		if (!path.isAbsolute(configFile)) {
			configFile = path.join(os.homedir(), configFile);
		}
	}
	try {
		if (fs.existsSync(configFile)) {
			const fileContent = fs.readFileSync(configFile, "utf-8");
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

// Combine Both Methods with Fallback
// Use the file-based method as the primary option, with VS Code settings as a fallback.
// export const LLM_PROVIDER_KEYS =
//     loadKeysFromFile() || loadKeysFromSettings() || [
//         {
//             settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
//             baseUrl: "https://api.x.ai/v1",
//             model: "grok-beta",
//             uses: 0,
//             name: "key01",
//             key: "xai-1"
//         },
//         {
//             settings: { temperature: 0.7, maxTokens: 100, topP: 1.0, frequencyPenalty: 0, presencePenalty: 0 },
//             baseUrl: "https://api.x.ai/v1",
//             model: "grok-beta",
//             uses: 0,
//             name: "key02",
//             key: "xai-2"
//         }
//     ];
