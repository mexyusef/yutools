import OpenAI from 'openai';
import { xaiSettings } from '../config';
import { CompletionRequest } from './xai';

export class XAILLMClientSingleton {
  private client: OpenAI;
  private static instance: XAILLMClientSingleton | null = null;

  public static getInstance(): XAILLMClientSingleton {
    if (!XAILLMClientSingleton.instance) {
      XAILLMClientSingleton.instance = new XAILLMClientSingleton();
    }
    return XAILLMClientSingleton.instance;
  }

  private constructor() {
    this.client = new OpenAI({
      apiKey: xaiSettings.getNextProvider().key,
      baseURL: 'https://api.x.ai/v1',
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
    const config = xaiSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: config.model, // request.model || "grok-beta",
      messages: request.messages,
    });

    return response.choices?.[0]?.message?.content || '';
  }

  private async *streamCompletion(request: CompletionRequest): AsyncIterable<string> {
    const config = xaiSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: config.model, // request.model || "grok-beta",
      messages: request.messages,
      stream: true,
    });

    for await (const chunk of response) {
      yield chunk.choices?.[0]?.delta?.content || '';
    }
  }
}
