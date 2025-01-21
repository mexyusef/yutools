import OpenAI from 'openai';
import { hyperbolicSettings } from '../config';
import { CompletionRequest } from './HyperbolicAI';

export class HyperbolicLLMClient {
  private client: OpenAI;

  constructor(
    // config: HyperbolicConfig
  ) {
    this.client = new OpenAI({
      baseURL: 'https://api.hyperbolic.xyz/v1',
      apiKey: hyperbolicSettings.getNextProvider().key,
    });
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
