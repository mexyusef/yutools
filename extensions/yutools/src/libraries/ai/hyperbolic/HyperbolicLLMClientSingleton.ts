import OpenAI from 'openai';
import { hyperbolicSettings } from '../config';
import { CompletionRequest } from './HyperbolicAI';

// HyperbolicLLMClientSingleton
export class HyperbolicLLMClientSingleton {
  private client: OpenAI;
  private static instance: HyperbolicLLMClientSingleton | null = null;

  public static getInstance(): HyperbolicLLMClientSingleton {
    if (!HyperbolicLLMClientSingleton.instance) {
      HyperbolicLLMClientSingleton.instance = new HyperbolicLLMClientSingleton();
    }
    return HyperbolicLLMClientSingleton.instance;
  }

  private constructor() {
    this.client = new OpenAI({
      baseURL: 'https://api.hyperbolic.xyz/v1',
      apiKey: hyperbolicSettings.getNextProvider().key,
    });
  }

  /**
   * Returns the OpenAI client instance.
   * @returns The OpenAI client.
   */
  public getClient(): OpenAI {
    return this.client;
  }

  async createCompletion(request: CompletionRequest): Promise<string | AsyncIterable<string>> {
    if (request.stream) {
      return this.streamCompletion(request);
    }
    const config = hyperbolicSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: config.model, // request.model,
      messages: request.messages,
    });

    return response.choices?.[0]?.message?.content || '';
  }

  private async *streamCompletion(request: CompletionRequest): AsyncIterable<string> {
    const config = hyperbolicSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: config.model, // request.model,
      messages: request.messages,
      stream: true,
    });

    for await (const chunk of response) {
      yield chunk.choices?.[0]?.delta?.content || '';
    }
  }
}
