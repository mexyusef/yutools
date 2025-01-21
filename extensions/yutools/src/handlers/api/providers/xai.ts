import OpenAI from "openai";

import { LLMMessageArray, LLMProviderKey, loadKeysFromFile } from "./config_getter_setter";
import { xaiDefaultModelId } from "../models";
import { systemPrompt } from "../common";

let USE_LLM_PROVIDER_KEYS = loadKeysFromFile("XAI_API_KEYS.json");

function getNextProvider(): LLMProviderKey {
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

function createXaiClient(provider: LLMProviderKey) {
  return new OpenAI({
    apiKey: provider.key,
    baseURL: provider.baseUrl || "https://api.x.ai/v1",
  });
}

export async function getCompletionXai(
  messages: LLMMessageArray
): Promise<string> {
  const provider = getNextProvider();
  try {
    const client = createXaiClient(provider);
    const model = provider.model ?? xaiDefaultModelId;
    const result = await client.chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      ...provider.settings,
    });

    // Extract and return the content of the first choice
    const content = result.choices[0]?.message?.content ?? "";
    console.log(`Response from ${provider.name}:`, content);
    return content;
  } catch (error) {
    console.error(`${provider.name} API error:`, error);
    throw error;
  }
}
