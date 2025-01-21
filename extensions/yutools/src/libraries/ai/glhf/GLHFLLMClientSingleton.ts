import OpenAI from 'openai';
import { glhfSettings } from '../config';
import { CompletionRequest } from './glhf';

export class GLHFLLMClientSingleton {
  private static instance: GLHFLLMClientSingleton | null = null; // Singleton instance
  private client: OpenAI;

  // Private constructor to prevent external instantiation
  private constructor() {
    this.client = new OpenAI({
      baseURL: 'https://glhf.chat/api/openai/v1',
      apiKey: glhfSettings.getNextProvider().key,
    });
  }

  /**
   * Returns the OpenAI client instance.
   * @returns The OpenAI client.
   */
  public getClient(): OpenAI {
    return this.client;
  }

  // const llmClient = GLHFLLMClientSingleton.getInstance();
  public static getInstance(): GLHFLLMClientSingleton {
    if (!GLHFLLMClientSingleton.instance) {
      GLHFLLMClientSingleton.instance = new GLHFLLMClientSingleton();
    }
    return GLHFLLMClientSingleton.instance;
  }

  async createCompletion(request: CompletionRequest): Promise<string | AsyncIterable<string>> {
    if (request.stream) {
      return this.streamCompletion(request);
    }
    const config = glhfSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: glhfSettings.getConfig().model,
      messages: request.messages,
    });

    return response.choices?.[0]?.message?.content || '';
  }

  private async *streamCompletion(request: CompletionRequest): AsyncIterable<string> {
    const config = glhfSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: glhfSettings.getConfig().model,
      messages: request.messages,
      stream: true,
    });

    for await (const chunk of response) {
      yield chunk.choices?.[0]?.delta?.content || '';
    }
  }
}
