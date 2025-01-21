import OpenAI from 'openai';
import { glhfSettings } from '../config';
import { CompletionRequest } from './glhf';

export class GLHFLLMClient {
  private client: OpenAI;

  constructor(
    // config: GLHFConfig
  ) {
    this.client = new OpenAI({
      baseURL: 'https://glhf.chat/api/openai/v1',
      apiKey: glhfSettings.getNextProvider().key
    });
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
