import OpenAI from 'openai';
import { sambanovaSettings } from '../config';
import { CompletionRequest } from './SambanovaAI';

export class SambanovaLLMClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      baseURL: 'https://api.sambanova.ai/v1',
      apiKey: sambanovaSettings.getNextProvider().key,
    });
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
