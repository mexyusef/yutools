/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Anthropic } from "@anthropic-ai/sdk";
import { ApiHandler } from "../";
import { ApiStream, ApiStreamTextChunk, ApiStreamUsageChunk } from "../transform/stream";
import fetch from "node-fetch";
import {
	ApiHandlerOptions,
	ModelInfo,
	sambaNovaDefaultModelId,
	SambaNovaModelId,
	sambaNovaModels,
} from '../../shared/api';
import { LLMProviderKey, loadKeysFromSettings } from "./config_getter_setter";


const sambanova_models = {
	"8b": "Meta-Llama-3.1-8B-Instruct",
	"70b": "Meta-Llama-3.1-70B-Instruct",
	"405b": "Meta-Llama-3.1-405B-Instruct",
	"1b": "Meta-Llama-3.2-1B-Instruct",
	"3b": "Meta-Llama-3.2-3B-Instruct",
	"v11b": "Llama-3.2-11B-Vision-Instruct",
	"v90b": "Llama-3.2-90B-Vision-Instruct",
};

let USE_LLM_PROVIDER_KEYS = loadKeysFromSettings("sambanovaProviderKeys");

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

export class SambanovaHandler implements ApiHandler {
	private options: ApiHandlerOptions;
	private baseURL: string;
	private provider: LLMProviderKey;

	constructor(options: ApiHandlerOptions) {
		this.provider = getNextProvider();
		this.options = options;
		this.baseURL = "https://api.sambanova.ai/v1/chat/completions";
		console.log(`
		******************************************* SAMBANOVA
		I:/vscode/extensions/cline/src/api/providers/sambanova.ts
			sambanova api menggunakan
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
	 * Create a message using SambaNova's API.
	 * @param systemPrompt The system instruction.
	 * @param messages List of message objects (user, system, assistant).
	 * @param stream Indicates if the response should be streamed.
	 */
	async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[], stream = false): ApiStream {
		const apiKey = this.getApiKey(); // Rotate key
		const payload = {
			// model: "Meta-Llama-3.1-8B-Instruct",
			model: this.getModel().id,
			stream,
			messages: [
				{ role: "system", content: systemPrompt },
				...messages.map((msg) => (typeof msg.content === "string" ? msg : {
					role: msg.role,
					content: msg.content.filter((block) => block.type === "text").map((block) => block.text).join(""),
				})),
			],
		};

		const response = await fetch(this.baseURL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			throw new Error(`SambaNova API error: ${response.statusText}`);
		}

		// if (stream) {
		// 	if (!response.body) {
		// 		throw new Error("Failed to get body for streaming response.");
		// 	}

		// 	const decoder = new TextDecoder("utf-8");
		// 	for await (const chunk of response.body) {
		// 		// Convert chunk to Uint8Array before decoding
		// 		const arrayBuffer = chunk instanceof Buffer ? chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength) : chunk;
		// 		const decoded = decoder.decode(arrayBuffer, { stream: true });

		// 		for (const part of decoded.split("\n").filter(Boolean)) {
		// 			const parsed = JSON.parse(part);
		// 			yield {
		// 				type: "text",
		// 				text: parsed.choices[0]?.message?.content || "",
		// 			} as ApiStreamTextChunk;
		// 		}
		// 	}
		// } else {
		// 	const data = await response.json();
		// 	yield {
		// 		type: "text",
		// 		text: data.choices[0]?.message?.content || "",
		// 	} as ApiStreamTextChunk;

		// 	const usage = data.usage || {};
		// 	yield {
		// 		type: "usage",
		// 		inputTokens: usage.input_tokens_count || 0,
		// 		outputTokens: usage.output_tokens_count || 0,
		// 	} as ApiStreamUsageChunk;
		// }
		if (stream) {
			if (!response.body) {
				throw new Error("Failed to get body for streaming response.");
			}

			const decoder = new TextDecoder("utf-8");
			for await (const chunk of response.body) {
				let arrayBuffer: ArrayBuffer;

				if (chunk instanceof Buffer) {
					// Convert Buffer to ArrayBuffer
					arrayBuffer = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength);
				} else if (typeof chunk === "string") {
					// Convert string to ArrayBuffer
					arrayBuffer = new TextEncoder().encode(chunk).buffer;
				} else {
					arrayBuffer = chunk; // Assume it's already an ArrayBuffer
				}

				const decoded = decoder.decode(new Uint8Array(arrayBuffer), { stream: true });

				for (const part of decoded.split("\n").filter(Boolean)) {
					const parsed = JSON.parse(part);
					yield {
						type: "text",
						text: parsed.choices[0]?.message?.content || "",
					} as ApiStreamTextChunk;
				}
			}
		} else {
			const data = await response.json();
			yield {
				type: "text",
				text: data.choices[0]?.message?.content || "",
			} as ApiStreamTextChunk;

			const usage = data.usage || {};
			yield {
				type: "usage",
				inputTokens: usage.input_tokens_count || 0,
				outputTokens: usage.output_tokens_count || 0,
			} as ApiStreamUsageChunk;
		}



	}

	/**
	 * Retrieve model information for SambaNova.
	 */
	// getModel(): { id: string; info: ModelInfo } {
	// 	return {
	// 		id: sambanova_models['70b'], // "Meta-Llama-3.1-8B-Instruct",
	// 		info: {
	// 			maxTokens: 2048,
	// 			contextWindow: 4096,
	// 			supportsImages: false,
	// 			supportsComputerUse: false,
	// 			supportsPromptCache: true,
	// 			description: "Meta-Llama-3.1-8B-Instruct by SambaNova.",
	// 		},
	// 	};
	// }
	getModel(): { id: SambaNovaModelId; info: ModelInfo } {
		const modelId = this.options.apiModelId;
		if (modelId && modelId in sambaNovaModels) {
			const id = modelId as SambaNovaModelId;
			return { id, info: sambaNovaModels[id] };
		}
		return { id: sambaNovaDefaultModelId, info: sambaNovaModels[sambaNovaDefaultModelId] };
	}
}
