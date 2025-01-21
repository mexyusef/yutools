/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable local/code-no-unexternalized-strings */

import OpenAI from "openai";
import { ApiHandler } from "../";
import { ApiStream, ApiStreamTextChunk, ApiStreamUsageChunk } from "../transform/stream";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {
	ApiHandlerOptions,
	hyperbolicDefaultModelId,
	HyperbolicModelId,
	hyperbolicModels,
	ModelInfo,
} from "../../shared/api";
import { LLMProviderKey, loadKeysFromSettings } from "./config_getter_setter";


const hyperbolic_models = {
	// https://app.hyperbolic.xyz/models
	// https://app.hyperbolic.xyz/models/qwen2-vl-72b-instruct/api
	'qwen-72b': "Qwen/Qwen2.5-Coder-32B-Instruct",
	// https://app.hyperbolic.xyz/models/deepseek-v2-5/api
	'deepseek-2.5': "deepseek-ai/DeepSeek-V2.5",
	// https://app.hyperbolic.xyz/models/llama31-405b/api
	'meta-llama-405b': "meta-llama/Meta-Llama-3.1-405B-Instruct",
	// https://app.hyperbolic.xyz/models/hermes3-70b/api
	'hermes-70b': "NousResearch/Hermes-3-Llama-3.1-70B",
	"llama-70b": "hyperbolic-meta-llama-3.1-70b-instruct",
	'meta-llama-70b': 'meta-llama/Meta-Llama-3-70B-Instruct',
};

const current_model_index = 'meta-llama-70b';
// const current_model_index = 'qwen-72b';

// https://app.hyperbolic.xyz/models

// export const LLM_PROVIDER_KEYS = 

// function getNextProvider() {
// 	try {
// 		if (!LLM_PROVIDER_KEYS.length) {
// 			throw new Error('No providers found in apiKeys.ts');
// 		}
// 		// Find the least used providers
// 		const minUses = Math.min(...LLM_PROVIDER_KEYS.map((p) => p.uses));
// 		const leastUsedProviders = LLM_PROVIDER_KEYS.filter((p) => p.uses === minUses);
// 		// Randomly select one of the least used providers
// 		const selectedProvider = leastUsedProviders[Math.floor(Math.random() * leastUsedProviders.length)];
// 		//   console.log(`Available providers: ${LLM_PROVIDER_KEYS.length}, using key ${selectedProvider.name}`);
// 		// Optional: Update the usage count locally (you would need to persist this if desired)
// 		selectedProvider.uses += 1;
// 		return selectedProvider;

// 	} catch (error) {
// 		console.error('Error in getNextProvider:', error);
// 		throw error;
// 	}
// }

let USE_LLM_PROVIDER_KEYS = loadKeysFromSettings("hyperbolicProviderKeys");

function getNextProvider() {
	if (USE_LLM_PROVIDER_KEYS === null || !USE_LLM_PROVIDER_KEYS.length) {
		throw new Error("No providers found in apiKeys.ts");
	}

  // Assign a default value for `uses` where it's undefined
  USE_LLM_PROVIDER_KEYS.forEach((p) => {
    if (p.uses === undefined) {
      p.uses = 0;
    }
  });

	const minUses = Math.min(...USE_LLM_PROVIDER_KEYS.map((p) => p.uses ?? 0));

	const leastUsedProviders = USE_LLM_PROVIDER_KEYS.filter((p) => p.uses === minUses);

	const selectedProvider = leastUsedProviders[Math.floor(Math.random() * leastUsedProviders.length)];

	selectedProvider.uses = (selectedProvider.uses ?? 0) + 1;

	return selectedProvider;
}


export class HyperbolicHandler implements ApiHandler {
	private options: ApiHandlerOptions;
	private baseURL: string;
	private provider: LLMProviderKey;

	constructor(options: ApiHandlerOptions) {
		this.provider = getNextProvider();
		this.options = options;
		this.baseURL = "https://api.hyperbolic.xyz/v1";
		console.log(`
		******************************************* HYPERBOLIC
		I:/vscode/extensions/cline/src/api/providers/hyperbolic.ts
			hyperbolic api menggunakan
			name = ${this.provider.name}
			key = ${this.provider.key}
		*******************************************
		`);
	}

	/**
	 * Rotates and retrieves the next API key.
	 */
	private getApiKey(): string {
		// const apiKey = this.apiKeys[this.keyIndex];
		// this.keyIndex = (this.keyIndex + 1) % this.apiKeys.length;
		// return apiKey;
		return this.provider.key;
	}

	/**
	 * Create a message using Hyperbolic's API.
	 * @param systemPrompt The system instruction.
	 * @param messages List of message objects (user, system, assistant).
	 */
	async *createMessage(systemPrompt: string, messages: MessageParam[]): ApiStream {
		const apiKey = this.getApiKey();
		const client = new OpenAI({
			apiKey,
			baseURL: this.baseURL,
		});

		// Prepare payload
		const payload = {
			messages: [
				{ role: "system", content: systemPrompt },
				...messages.map((msg) => ({
					role: msg.role,
					content: Array.isArray(msg.content)
						? msg.content
							.filter((block: any) => block.type === "text")
							.map((block: any) => block.text)
							.join("")
						: msg.content,
				})),
			] as ChatCompletionMessageParam[],
			// model: hyperbolic_models[current_model_index], //"meta-llama/Meta-Llama-3.1-70B-Instruct",
			model: this.getModel().id,
			// stream: true, // ini bikin gagal
		};

		// console.log(`hyperbolic request: ${JSON.stringify(payload, null, 2)}`);
		// Fetch response
		const response = await client.chat.completions.create(payload);

		// console.log(`
		// 	===================================
		// 	hyperbolic response: ${JSON.stringify(response, null, 2)}
		// 	===================================
		// `);

		if (Array.isArray((response as any).choices)) {
			// Non-streaming response
			const content = (response as any).choices[0]?.message?.content || "";
			yield {
				type: "text",
				text: content,
			} as ApiStreamTextChunk;

			const usage = (response as any).usage || {};
			yield {
				type: "usage",
				inputTokens: usage.input_tokens || 0,
				outputTokens: usage.output_tokens || 0,
			} as ApiStreamUsageChunk;
		} else {
			// Streaming response, ini gak bakalan tercapai anyway krn hyperbolic gak streaming...
			// let content = "";
			// for await (const chunk of response as AsyncIterable<any>) {
			// 	// Safely check for `delta` and its `content`
			// 	if (chunk?.delta?.content) {
			// 		content += chunk.delta.content; // Accumulate content
			// 		yield {
			// 			type: "text",
			// 			text: content,
			// 		} as ApiStreamTextChunk;
			// 	}
			// }
		}



	}

	/**
	 * Returns model metadata.
	 */
	// getModel() {
	// 	return {
	// 		id: hyperbolic_models[current_model_index], //"hyperbolic-meta-llama-3.1-70b-instruct",
	// 		info: {
	// 			maxTokens: 4096,
	// 			contextWindow: 4096,
	// 			supportsImages: false,
	// 			supportsComputerUse: false,
	// 			supportsPromptCache: false,
	// 			inputPrice: 0.01,
	// 			outputPrice: 0.02,
	// 			description: "Hyperbolic Meta-Llama 3.1 70B model for text completions",
	// 		},
	// 	};
	// }
	getModel(): { id: HyperbolicModelId; info: ModelInfo } {
		const modelId = this.options.apiModelId;
		if (modelId && modelId in hyperbolicModels) {
			const id = modelId as HyperbolicModelId;
			return { id, info: hyperbolicModels[id] };
		}
		return { id: hyperbolicDefaultModelId, info: hyperbolicModels[hyperbolicDefaultModelId] };
	}
}
