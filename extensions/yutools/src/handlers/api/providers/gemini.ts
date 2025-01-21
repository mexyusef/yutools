import { GoogleGenerativeAI } from "@google/generative-ai";
import { geminiDefaultModelId } from "../models";
import { convertAnthropicMessageToGemini } from "../transform/gemini-format";
import Anthropic from "@anthropic-ai/sdk";
import { LLMMessageArray, LLMProviderKey, loadKeysFromFile } from "./config_getter_setter";
import { systemPrompt } from "../common";

let USE_LLM_PROVIDER_KEYS = loadKeysFromFile("GOOGLE_GEMINI_API_KEYS.json");

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

function createGeminiClient(provider: LLMProviderKey): GoogleGenerativeAI {
  return new GoogleGenerativeAI(provider.key);
}

// https://github.com/google-gemini/generative-ai-js/blob/main/samples/text_generation.js
export async function getCompletionGemini(
  messages: Anthropic.Messages.MessageParam[]
): Promise<string> {
  // Get the next provider
  const provider: LLMProviderKey = getNextProvider();
  const client = createGeminiClient(provider);

  const modelId = provider.model ?? geminiDefaultModelId;

  try {
    const model = await client.getGenerativeModel({
      model: modelId,
      systemInstruction: systemPrompt,
    });

    // Generate the content
    const result = await model.generateContent({
      contents: messages.map(convertAnthropicMessageToGemini),
      generationConfig: {
        temperature: provider.settings?.temperature ?? 0.7,
        // maxOutputTokens: optional based on provider.settings?.maxTokens
      },
    });
    return result.response.text();
  } catch (error) {
    console.error(`Error in GeminiHandler:`, error);
    throw error;
  }
}
