import { CohereClientV2 } from 'cohere-ai';
import { CohereSettings, cohereSettings, LLMConfig } from '../config';
import { CohereConfig, CompletionRequest } from './cohere';

export class CohereLLMClientSingleton {
  private client: CohereClientV2;
  config: LLMConfig;
  settings: CohereSettings;
  private static instance: CohereLLMClientSingleton | null = null;

  public static getInstance(): CohereLLMClientSingleton {
    if (!CohereLLMClientSingleton.instance) {
      CohereLLMClientSingleton.instance = new CohereLLMClientSingleton();
    }
    return CohereLLMClientSingleton.instance;
  }

  private constructor() {
    this.settings = cohereSettings;
    this.config = this.settings.getConfig();
    // C:\ai\yuagent\extensions\yutools\node_modules\cohere-ai\ClientV2.d.ts
    this.client = new CohereClientV2({
      token: this.settings.getNextProvider().key // config.apiKey || default_api_key,
    });
  }

  /**
   * Returns the OpenAI client instance.
   * @returns The OpenAI client.
   */
  public getClient(): CohereClientV2 {
    return this.client;
  }

  async createCompletion(request: CompletionRequest): Promise<string | AsyncIterable<string>> {
    if (request.stream) {
      return this.streamCompletion(request);
    }
    const response = await this.client.chat({
      model: this.config.model, // request.model || 'command-r-plus-08-2024',
      messages: request.messages,
    });
    // C:\ai\yuagent\extensions\yutools\node_modules\cohere-ai\api\types\ChatResponse.d.ts
    // C:\ai\yuagent\extensions\yutools\node_modules\cohere-ai\api\types\AssistantMessageResponse.d.ts
    // return response.message.content || '';

    // Extract content items if they exist
    if (response.message?.content) {
      const contentItems = response.message.content;

      // Iterate over content items and concatenate their text
      const processedResponse = contentItems
        .map((item) => item.type === "text" ? item.text : "")
        .join("");

      return processedResponse;
    } else {
      return ""; // Return empty string if no content is present
    }

  }

  private async *streamCompletion(request: CompletionRequest): AsyncIterable<string> {
    const stream = await this.client.chatStream({
      model: this.config.model, // request.model || 'command-r-plus-08-2024',
      messages: request.messages,
    });
    // for await (const chatEvent of stream) {
    //   if (chatEvent.type === 'content-delta') {
    //     yield chatEvent.delta?.message || '';
    //   }
    // }
    for await (const chatEvent of stream) {
      if (chatEvent.type === 'content-delta') {
        const messageContent = chatEvent.delta?.message?.content;
        if (messageContent?.text) {
          yield messageContent.text;
        }
      }
    }
    
  }

}
