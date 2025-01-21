/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Anthropic } from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { ApiHandler } from "../";
import { ApiStream, ApiStreamTextChunk, ApiStreamUsageChunk } from "../transform/stream";
import {
	ApiHandlerOptions,
	// ApiHandlerOptions, geminiDefaultModelId, GeminiModelId, geminiModels,
	ModelInfo,
	XAIModelId,
	xaiModels
} from "../../shared/api";
// Load usage persistence utilities
import fs from 'fs';
import path from 'path';
import os from "os";
// import { TextBlockParam } from '@anthropic-ai/sdk/resources/messages.mjs';
import { TextBlockParam } from '@anthropic-ai/sdk/resources/messages';
import * as vscode from "vscode";
import { LLM_PROVIDER_KEYS, xaiDefaultModelId } from "./xai-keys";


// Placeholder for model details
// const xaiModels: Record<string, ModelInfo> = {
// 	// "grok-beta": {
// 	// 	name: "Grok Beta",
// 	// 	maxTokens: 2048,
// 	// 	description: "A chatbot inspired by the Hitchhiker's Guide to the Galaxy.",
// 	// },
// 	"grok-beta": {
// 		maxTokens: 131072, // Context window size in tokens
// 		contextWindow: 131072, // Matching the context specification
// 		supportsImages: false, // This model does not support images
// 		supportsComputerUse: false, // No explicit computer-use support in specs
// 		supportsPromptCache: true, // Assuming this is enabled by default
// 		inputPrice: 5.00, // Price per thousand input tokens
// 		outputPrice: 15.00, // Price per thousand output tokens
// 		cacheWritesPrice: 1.00, // Per request storage writes
// 		cacheReadsPrice: 60.00, // Per minute cache reads
// 		description: "Grok Beta is a text-only model with a large context window for generating text responses.",
// 	},
// };
// const USAGE_FILE_PATH = path.resolve(__dirname, 'keyUsage.json');
const USAGE_FILE_PATH = path.join(os.homedir(), 'keyUsage.json');
// vs %userprofile%\llm_provider_keys.json
const CONFIG_FILE_PATH = path.join(os.homedir(), "llm_provider_keys.json");

function loadKeysFromFile(): typeof LLM_PROVIDER_KEYS | null {
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

// "contributes": {
//     "configuration": {
//         "type": "object",
//         "title": "LLM Provider Settings",
//         "properties": {
//             "llmProviderKeys": {
//                 "type": "array",
//                 "description": "Keys for LLM providers in JSON format",
//                 "default": []
//             }
//         }
//     }
// }
// const sharedKeys = vscode.workspace.getConfiguration().get("sharedLLMProviderKeys") as typeof LLM_PROVIDER_KEYS;
// if (sharedKeys) {
//     console.log("Shared LLM_PROVIDER_KEYS:", sharedKeys);
// }
// vscode.workspace.getConfiguration().update("sharedLLMProviderKeys", updatedKeys, vscode.ConfigurationTarget.Global);

function loadKeysFromSettings(): typeof LLM_PROVIDER_KEYS | null {
	try {
			const config = vscode.workspace.getConfiguration();
			const keys = config.get("llmProviderKeys");
			if (keys && Array.isArray(keys)) {
					return keys as typeof LLM_PROVIDER_KEYS;
			}
	} catch (err) {
			console.error("Error reading keys from settings:", err);
	}
	return null;
}

function saveKeysToSettings(keys: typeof LLM_PROVIDER_KEYS): void {
	try {
			const config = vscode.workspace.getConfiguration();
			config.update("llmProviderKeys", keys, vscode.ConfigurationTarget.Global);
	} catch (err) {
			console.error("Error saving keys to settings:", err);
	}
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

function loadUsageData() {
	if (fs.existsSync(USAGE_FILE_PATH)) {
		return JSON.parse(fs.readFileSync(USAGE_FILE_PATH, 'utf-8'));
	}
	return {};
}

function saveUsageData(usageData: Record<string, number>) {
	fs.writeFileSync(USAGE_FILE_PATH, JSON.stringify(usageData, null, 2));
}

function getNextProvider() {
	if (!LLM_PROVIDER_KEYS.length) {
		throw new Error("No providers found in apiKeys.ts");
	}

	// // sementara file ini gak ada
	// const usageData = loadUsageData();

	// LLM_PROVIDER_KEYS.forEach((provider) => {
	// 	provider.uses = usageData[provider.name] || 0;
	// });

	const minUses = Math.min(...LLM_PROVIDER_KEYS.map((p) => p.uses));
	const leastUsedProviders = LLM_PROVIDER_KEYS.filter((p) => p.uses === minUses);

	const selectedProvider = leastUsedProviders[Math.floor(Math.random() * leastUsedProviders.length)];

	selectedProvider.uses += 1;
	// // sementara file ini gak ada
	// usageData[selectedProvider.name] = selectedProvider.uses;
	// saveUsageData(usageData);

	return selectedProvider;
}

export class XaiHandler implements ApiHandler {
	private client: OpenAI;
	private provider: { name: string; key: string; uses: number };
	private options: ApiHandlerOptions;

	constructor(options: ApiHandlerOptions) {
		this.provider = getNextProvider();
		this.options = options;
		this.client = new OpenAI({
			apiKey: this.provider.key,
			baseURL: "https://api.x.ai/v1",
		});
		console.log(`
		******************************************* XAI
		I:/vscode/extensions/cline/src/api/providers/xai.ts
			x.ai api menggunakan
			name = ${this.provider.name}
			key = ${this.provider.key}
		*******************************************
		`);
	}

	async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
		// const grokMessages = messages.map((msg) => ({
		// 	role: msg.role,
		// 	content:
		// 		typeof msg.content === "string"
		// 			? msg.content
		// 			: msg.content.map((block) => block.text).join(""),
		// }));
		const grokMessages = messages.map((msg) => ({
			role: msg.role,
			content:
				typeof msg.content === "string"
					? msg.content
					: msg.content
						.filter((block) => block.type === "text") // Keep only `TextBlockParam`
						.map((block) => (block as TextBlockParam).text) // Safe type assertion
						.join(""),
		}));

		const result = await this.client.chat.completions.create({
			// model: xaiDefaultModelId,
			model: this.getModel().id,
			messages: [{ role: "system", content: systemPrompt }, ...grokMessages],
		});

		for (const choice of result.choices) {
			yield {
				type: "text",
				text: choice.message.content ?? "",
			}; // as ApiStreamTextChunk;
		}

		yield {
			type: "usage",
			inputTokens: result.usage?.prompt_tokens ?? 0,
			outputTokens: result.usage?.completion_tokens ?? 0,
			totalCost: result.usage
				? ((result.usage.prompt_tokens ?? 0) / 1000) * 5.0 +
				((result.usage.completion_tokens ?? 0) / 1000) * 15.0
				: undefined,
		}; // as ApiStreamUsageChunk;
	}
	// getModel(): { id: string; info: ModelInfo } {
	// 	const id = xaiDefaultModelId;
	// 	return { id, info: xaiModels[id] };
	// }

	getModel(): { id: XAIModelId; info: ModelInfo } {
		const modelId = this.options.apiModelId;
		if (modelId && modelId in xaiModels) {
			const id = modelId as XAIModelId;
			return { id, info: xaiModels[id] };
		}
		return { id: xaiDefaultModelId, info: xaiModels[xaiDefaultModelId] };
	}
}
