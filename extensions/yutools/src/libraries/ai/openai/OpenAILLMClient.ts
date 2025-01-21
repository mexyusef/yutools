import OpenAI from 'openai';
import { openaiSettings } from '../config';
import { CompletionRequest } from './openai-llm';

export class OpenAILLMClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: openaiSettings.getNextProvider().key,
    });
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
