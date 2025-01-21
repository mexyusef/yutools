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
} from "../models";
import { LLMProviderKey, loadKeysFromFile } from "./config_getter_setter";
import { systemPrompt } from "../common";

let USE_LLM_PROVIDER_KEYS = loadKeysFromFile("SAMBANOVA_API_KEYS.json");

function getNextProvider() {
  if (USE_LLM_PROVIDER_KEYS === null || !USE_LLM_PROVIDER_KEYS.length) {
    throw new Error("No providers found in apiKeys.ts");
  }

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

function createSambanovaClient(apiKey: string) {
  return {
    baseURL: "https://api.sambanova.ai/v1/chat/completions",
    apiKey,
  };
}

export async function getCompletionSambanova(
  messages: Anthropic.Messages.MessageParam[],
  options?: ApiHandlerOptions,
  stream = false
): Promise<{ type: string; text?: string; inputTokens?: number; outputTokens?: number }[]> {
  const provider: LLMProviderKey = getNextProvider();
  const client = createSambanovaClient(provider.key);

  const modelId = options?.apiModelId ?? sambaNovaDefaultModelId;

  // Format messages
  const payload = {
    model: modelId,
    stream,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => {
        if (typeof msg.content === "string") {
          return { role: msg.role, content: msg.content };
        } else {
          return {
            role: msg.role,
            content: msg.content
              .filter((block) => block.type === "text")
              .map((block) => block.text)
              .join(""),
          };
        }
      }),
    ],
  };

  try {
    const response = await fetch(client.baseURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${client.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`SambaNova API error: ${response.statusText}`);
    }

    // Handle stream response
    if (stream) {
      if (!response.body) {
        throw new Error("Failed to get body for streaming response.");
      }

      const decoder = new TextDecoder("utf-8");
      const resultChunks: { type: string; text: string }[] = [];
      
      for await (const chunk of response.body) {
        let arrayBuffer: ArrayBuffer;

        if (chunk instanceof Buffer) {
          arrayBuffer = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength);
        } else if (typeof chunk === "string") {
          arrayBuffer = new TextEncoder().encode(chunk).buffer;
        } else {
          arrayBuffer = chunk;
        }

        const decoded = decoder.decode(new Uint8Array(arrayBuffer), { stream: true });

        for (const part of decoded.split("\n").filter(Boolean)) {
          const parsed = JSON.parse(part);
          resultChunks.push({
            type: "text",
            text: parsed.choices[0]?.message?.content || "",
          });
        }
      }

      return resultChunks;
    } else {
      // Non-stream response
      const data = await response.json();
      const result: { type: string; text?: string; inputTokens?: number; outputTokens?: number }[] = [
        {
          type: "text",
          text: data.choices[0]?.message?.content || "",
        }
      ];

      const usage = data.usage || {};
      if (usage.input_tokens_count || usage.output_tokens_count) {
        result.push({
          type: "usage",
          inputTokens: usage.input_tokens_count || 0,
          outputTokens: usage.output_tokens_count || 0,
        });
      }

      return result;
    }
  } catch (error) {
    console.error("Error in SambaNovaHandler:", error);
    throw error;
  }
}
