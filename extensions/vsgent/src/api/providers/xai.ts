/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable local/code-no-unexternalized-strings */
import { Anthropic } from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { ApiHandler } from "../";
import {
	ApiStream,
	// ApiStreamTextChunk,
	// ApiStreamUsageChunk
} from "../transform/stream";
import { TextBlockParam } from '@anthropic-ai/sdk/resources/messages';
import { ApiHandlerOptions, xaiDefaultModelId, XAIModelId, xaiModels, ModelInfo } from "../../shared/api"

import { LLMProviderKey, loadKeysFromSettings } from "./config_getter_setter";

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

let USE_LLM_PROVIDER_KEYS = loadKeysFromSettings("xaiProviderKeys");

function getNextProvider() {
	if (USE_LLM_PROVIDER_KEYS === null || !USE_LLM_PROVIDER_KEYS.length) {
		throw new Error("No providers found in apiKeys.ts");
	}

	// // sementara file ini gak ada
	// const usageData = loadUsageData();
	// LLM_PROVIDER_KEYS.forEach((provider) => {
	// 	provider.uses = usageData[provider.name] || 0;
	// });
  // Assign a default value for `uses` where it's undefined
  USE_LLM_PROVIDER_KEYS.forEach((p) => {
    if (p.uses === undefined) {
      p.uses = 0;
    }
  });

	// const minUses = Math.min(...USE_LLM_PROVIDER_KEYS.map((p) => p.uses));
	const minUses = Math.min(...USE_LLM_PROVIDER_KEYS.map((p) => p.uses ?? 0));

	const leastUsedProviders = USE_LLM_PROVIDER_KEYS.filter((p) => p.uses === minUses);

	const selectedProvider = leastUsedProviders[Math.floor(Math.random() * leastUsedProviders.length)];
	// if (selectedProvider.uses === undefined || selectedProvider.uses === null) {
	// 	selectedProvider.uses = 0;
	// }
	// selectedProvider.uses += 1;
	selectedProvider.uses = (selectedProvider.uses ?? 0) + 1;

	// // sementara file ini gak ada
	// usageData[selectedProvider.name] = selectedProvider.uses;
	// saveUsageData(usageData);

	return selectedProvider;
}

export class XaiHandler implements ApiHandler {
	private client: OpenAI;
	private provider: LLMProviderKey; //{ name: string; key: string; uses: number };
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
