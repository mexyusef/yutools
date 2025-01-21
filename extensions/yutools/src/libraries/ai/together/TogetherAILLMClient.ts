import OpenAI from 'openai';
import { togetherSettings } from '../config';
import { CompletionRequest } from './together';

export class TogetherAILLMClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: togetherSettings.getNextProvider().key,
      baseURL: 'https://api.together.xyz/v1',
    });
  }

  async createCompletion(request: CompletionRequest): Promise<string | AsyncIterable<string>> {
    if (request.stream) {
      return this.streamCompletion(request);
    }
    const config = togetherSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: config.model, // request.model || default_model,
      messages: request.messages,
    });

    return response.choices?.[0]?.message?.content || '';
  }

  private async *streamCompletion(request: CompletionRequest): AsyncIterable<string> {
    const config = togetherSettings.getConfig();
    const response = await this.client.chat.completions.create({
      model: config.model, // request.model || default_model,
      messages: request.messages,
      stream: true,
    });

    for await (const chunk of response) {
      yield chunk.choices?.[0]?.delta?.content || '';
    }
  }
}