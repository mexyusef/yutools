import OpenAI from "openai";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import {
	ApiHandlerOptions,
	hyperbolicDefaultModelId,
	HyperbolicModelId,
	hyperbolicModels,
	ModelInfo,
} from "../models";
import { LLMMessageArray, LLMProviderKey, loadKeysFromFile } from "./config_getter_setter";
import { systemPrompt } from "../common";

let USE_LLM_PROVIDER_KEYS = loadKeysFromFile("HYPERBOLIC_API_KEYS.json");

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

function createClient(provider: LLMProviderKey) {
  return new OpenAI({
    apiKey: provider.key,
    baseURL: provider.baseUrl || "https://api.hyperbolic.xyz/v1",
  });
}

export async function getCompletionHyperbolic(
	messages: MessageParam[]
): Promise<string> {
	const provider = getNextProvider();
  const client = createClient(provider);
  const payload = {
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: Array.isArray(msg.content)
          ? msg.content.filter((block: any) => block.type === "text").map((block: any) => block.text).join("")
          : msg.content,
      })),
    ] as ChatCompletionMessageParam[],
    model: hyperbolicDefaultModelId,
  };

  try {
    const response = await client.chat.completions.create(payload);

    // If the response contains choices, extract the text content
    if (Array.isArray(response.choices) && response.choices.length > 0) {
      const content = response.choices[0]?.message?.content || "";
      return content;
    } else {
      throw new Error("No valid response content.");
    }
  } catch (error) {
    console.error("Error in generating text:", error);
    throw new Error("Failed to generate text");
  }
}

