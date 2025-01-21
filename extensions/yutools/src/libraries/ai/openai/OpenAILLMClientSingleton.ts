import OpenAI from 'openai';
import { openaiSettings } from '../config';
import { CompletionRequest } from './openai-llm';

export class OpenAILLMClientSingleton {
  private client: OpenAI;
  private static instance: OpenAILLMClientSingleton | null = null;

  public static getInstance(): OpenAILLMClientSingleton {
    if (!OpenAILLMClientSingleton.instance) {
      OpenAILLMClientSingleton.instance = new OpenAILLMClientSingleton();
    }
    return OpenAILLMClientSingleton.instance;
  }

  private constructor() {
    this.client = new OpenAI({
      apiKey: openaiSettings.getNextProvider().key,
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
    const config = openaiSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: config.model, // request.model || "gpt-4o-mini",
      messages: request.messages,
    });

    return response.choices?.[0]?.message?.content || '';
  }

  private async *streamCompletion(request: CompletionRequest): AsyncIterable<string> {
    const config = openaiSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: config.model, // request.model || "gpt-4o-mini",
      messages: request.messages,
      stream: true,
    });

    for await (const chunk of response) {
      yield chunk.choices?.[0]?.delta?.content || '';
    }
  }
}

// const openaiClient = OpenAILLMClientSingleton.getInstance().getClient();
// Now you can use openaiClient to interact with the OpenAI API directly.