// import OpenAI from 'openai';
// import { hyperbolicSettings } from '../config';

export interface HyperbolicConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CompletionRequest {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
}

// export class HyperbolicLLMClient {
//   private client: OpenAI;

//   constructor(
//     // config: HyperbolicConfig
//   ) {
//     this.client = new OpenAI({
//       baseURL: 'https://api.hyperbolic.xyz/v1',
//       apiKey: hyperbolicSettings.getNextProvider().key,
//     });
//   }

//   async createCompletion(request: CompletionRequest): Promise<string | AsyncIterable<string>> {
//     if (request.stream) {
//       return this.streamCompletion(request);
//     }
//     const config = hyperbolicSettings.getConfig();
//     const response = await this.client.chat.completions.create({
//       model: config.model, // request.model,
//       messages: request.messages,
//     });

//     return response.choices?.[0]?.message?.content || '';
//   }

//   private async *streamCompletion(request: CompletionRequest): AsyncIterable<string> {
//     const config = hyperbolicSettings.getConfig();
//     const response = await this.client.chat.completions.create({
//       model: config.model, // request.model,
//       messages: request.messages,
//       stream: true,
//     });

//     for await (const chunk of response) {
//       yield chunk.choices?.[0]?.delta?.content || '';
//     }
//   }
// }

export { HyperbolicLLMClient } from './HyperbolicLLMClient';
export { HyperbolicLLMClientSingleton } from './HyperbolicLLMClientSingleton';
