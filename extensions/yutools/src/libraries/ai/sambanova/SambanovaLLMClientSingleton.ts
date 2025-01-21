import OpenAI from 'openai';
import { sambanovaSettings } from '../config';
import { CompletionRequest } from './SambanovaAI';

export class SambanovaLLMClientSingleton {
  private client: OpenAI;
  private static instance: SambanovaLLMClientSingleton | null = null;

  public static getInstance(): SambanovaLLMClientSingleton {
    if (!SambanovaLLMClientSingleton.instance) {
      SambanovaLLMClientSingleton.instance = new SambanovaLLMClientSingleton();
    }
    return SambanovaLLMClientSingleton.instance;
  }

  private constructor() {
    this.client = new OpenAI({
      baseURL: 'https://api.sambanova.ai/v1',
      apiKey: sambanovaSettings.getNextProvider().key,
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
    const config = sambanovaSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: config.model, // request.model,
      messages: request.messages,
    });

    return response.choices?.[0]?.message?.content || '';
  }

  private async *streamCompletion(request: CompletionRequest): AsyncIterable<string> {
    const config = sambanovaSettings.getConfig();
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
