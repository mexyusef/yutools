import OpenAI from 'openai';
import { system_prompt } from '../../constants';
import { LLMMessageArray, LLMProviderKey, loadKeysFromFile } from './providers/config_getter_setter';
import { xaiDefaultModelId } from './models';

// interface ProviderSettings {
//   temperature: number;
//   maxTokens: number;
//   topP: number;
//   frequencyPenalty: number;
//   presencePenalty: number;
// }

// interface ProviderData {
//   name: string;
//   key: string;
//   baseUrl: string;
//   model: string;
//   settings: ProviderSettings;
//   uses: number;
// }

let LLM_PROVIDER_KEYS = loadKeysFromFile("XAI_API_KEYS.json");

const defaultModel = xaiDefaultModelId;

function getNextProvider() {
  try {

    if (LLM_PROVIDER_KEYS === null || !LLM_PROVIDER_KEYS.length) {
      throw new Error('No providers found in apiKeys.ts');
    }
    LLM_PROVIDER_KEYS.forEach((p) => {
      if (p.uses === undefined) {
        p.uses = 0;
      }
    });
    // const minUses = Math.min(...LLM_PROVIDER_KEYS.map((p) => p.uses));
    const minUses = Math.min(...LLM_PROVIDER_KEYS.map((p) => p.uses ?? 0));
    const leastUsedProviders = LLM_PROVIDER_KEYS.filter((p) => p.uses === minUses);
    const selectedProvider = leastUsedProviders[Math.floor(Math.random() * leastUsedProviders.length)];
    selectedProvider.uses = (selectedProvider.uses ?? 0) + 1;
    return selectedProvider;

  } catch (error) {
    console.error('Error in getNextProvider:', error);
    throw error;
  }
}

function createOpenAIClient(provider: LLMProviderKey) {
  return new OpenAI({
    apiKey: provider.key,
    baseURL: provider.baseUrl,
  });
}

export async function getChatCompletion(
  // messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
  messages: LLMMessageArray
) {
  const provider = getNextProvider();
  try {
    const openai = createOpenAIClient(provider);

    const systemMessage = {
      role: 'system' as const,
      content: system_prompt
    };

    const completion = await openai.chat.completions.create({
      model: provider.model ?? defaultModel,
      messages: [systemMessage, ...messages],
      ...provider.settings,
    });

    const result = completion.choices[0].message;
    console.log(`Response from ${provider.name}:`, result.content);
    return result;
  } catch (error) {
    console.error(`${provider.name} API error:`, error);
    throw error;
  }
}
