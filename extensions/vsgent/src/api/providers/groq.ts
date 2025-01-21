import Groq from "groq-sdk";
// npm install --save groq-sdk
// https://console.groq.com/docs/openai
// elon https://chatgpt.com/c/673a14dc-17f4-8007-9a35-93233b8eaab5
import { Anthropic } from "@anthropic-ai/sdk";
import { ApiHandler } from "../";
import { ApiStream, ApiStreamTextChunk, ApiStreamUsageChunk } from "../transform/stream";
import {
    ApiHandlerOptions,
    groqDefaultModelId,
    GroqModelId,
    groqModels,
    ModelInfo 
} from '../../shared/api';
import { LLMProviderKey, loadKeysFromSettings } from "./config_getter_setter";

let USE_LLM_PROVIDER_KEYS = loadKeysFromSettings("groqProviderKeys");

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

export class GroqHandler implements ApiHandler {
    private groq: any;
    private selectedModelId: GroqModelId = "llama-3.1-70b-versatile"; // Set the default index here
    private provider: LLMProviderKey;
    private options: ApiHandlerOptions;

    constructor(options: ApiHandlerOptions) {
        this.provider = getNextProvider();
        this.options = options;
        this.groq = new Groq({ apiKey: this.provider.key });
        console.log(`
        ******************************************* GROQ
        I:/vscode/extensions/cline/src/api/providers/groq.ts
            GROQ api menggunakan
            name = ${this.provider.name}
            key = ${this.provider.key}
        *******************************************
        `);
    }

    getModel(): { id: GroqModelId; info: ModelInfo } {
        const modelId = this.options.apiModelId;
        if (modelId && modelId in groqModels) {
            const id = modelId as GroqModelId;
            return { id, info: groqModels[id] };
        }
        return { id: groqDefaultModelId, info: groqModels[groqDefaultModelId] };
    }

    async *createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
        // Format the messages to match the API structure
        const formattedMessages = [
            { role: "system", content: systemPrompt },
            ...messages.map((msg) => ({
                role: msg.role,
                content: this.formatMessageContent(msg.content),
            })),
        ];
        console.log(`GROQ request: ${JSON.stringify(formattedMessages, null, 2)}`);

        // Send the request to the Groq API
        const response = await this.groq.chat.completions.create({
            messages: formattedMessages,
            model: this.getModel().id, // Your selected model
        });
        console.log(`GROQ response: ${JSON.stringify(response, null, 2)}`);

        // Extract the response content
        const choice = response.choices?.[0];
        if (choice?.message?.content) {
            // Emit the full response text as a single chunk
            yield {
                type: "text",
                text: choice.message.content,
            } as ApiStreamTextChunk;
        }

        // Emit usage details, if available
        if (response.usage) {
            yield {
                type: "usage",
                inputTokens: response.usage.prompt_tokens || 0,
                outputTokens: response.usage.completion_tokens || 0,
                totalCost: response.usage.total_tokens || 0,
            } as ApiStreamUsageChunk;
        }
    }


    // async *createMessage2(systemPrompt: string, messages: Anthropic.Messages.MessageParam[]): ApiStream {
    //     const formattedMessages = [
    //         { role: "system", content: systemPrompt },
    //         ...messages.map((msg) => ({
    //             role: msg.role,
    //             content: this.formatMessageContent(msg.content),
    //         })),
    //     ];
    //     console.log(`GROQ request: ${JSON.stringify(formattedMessages, null, 2)}`);
    //     const response = await this.groq.chat.completions.create({
    //         messages: formattedMessages,
    //         // model: "llama3-8b-8192",
    //         model: this.getModel().id,
    //         // stream: true,
    //     });
    //     console.log(`
    // 		=================================== I:/vscode/extensions/cline/src/api/providers/groq.ts
    // 		GROQ response: ${JSON.stringify(response, null, 2)}
    // 		===================================
    // 	`);
    //     if (!response.body) {
    //         throw new Error("Failed to get body for streaming response.");
    //     }

    //     const decoder = new TextDecoder("utf-8");
    //     for await (const chunk of response.body) {
    //         let arrayBuffer: ArrayBuffer;

    //         if (chunk instanceof Buffer) {
    //             arrayBuffer = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength);
    //         } else if (typeof chunk === "string") {
    //             arrayBuffer = new TextEncoder().encode(chunk).buffer;
    //         } else {
    //             arrayBuffer = chunk; // Assume it's already an ArrayBuffer
    //         }

    //         const decoded = decoder.decode(new Uint8Array(arrayBuffer), { stream: true });

    //         for (const part of decoded.split("\n").filter(Boolean)) {
    //             const parsed = JSON.parse(part);
    //             const choice = parsed.choices[0];

    //             if (choice?.message?.content) {
    //                 yield {
    //                     type: "text",
    //                     text: choice.message.content,
    //                 } as ApiStreamTextChunk;
    //             }

    //             if (parsed.usage) {
    //                 yield {
    //                     type: "usage",
    //                     inputTokens: parsed.usage.prompt_tokens || 0,
    //                     outputTokens: parsed.usage.completion_tokens || 0,
    //                     totalCost: parsed.usage.total_tokens || 0,
    //                 } as ApiStreamUsageChunk;
    //             }
    //         }
    //     }
    // }

    private formatMessageContent(content: any): string {
        if (Array.isArray(content)) {
            return content
                .map((block) => {
                    if (block.type === "text") {
                        return block.text;
                    } else if (block.type === "image") {
                        return `[Image: ${block.source.media_type}]`;
                    } else if (block.type === "tool_use") {
                        return `[ToolUse: ${block.name}]`;
                    } else if (block.type === "tool_result") {
                        return `[ToolResult: ${block.content ? "Success" : "Error"}]`;
                    } else {
                        return "[Unknown Content]";
                    }
                })
                .join("\n");
        } else if (typeof content === "string") {
            return content;
        } else {
            return "[Unsupported Content]";
        }
    }
}
