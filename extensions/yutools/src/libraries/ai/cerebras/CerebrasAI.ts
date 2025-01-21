// import Cerebras from '@cerebras/cerebras_cloud_sdk';
// import { CerebrasSettings, cerebrasSettings, LLMConfig } from '../config';

export interface CerebrasConfig {
  apiKey?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CompletionRequest {
  messages: ChatMessage[];
  model?: 'llama3.1-8b' | 'llama3.3-70b';
  stream?: boolean;
}

// export class CerebrasLLMClient {
//   private client: any;
//   config: LLMConfig;
//   settings: CerebrasSettings;

//   constructor() {
//     this.settings = cerebrasSettings;
//     this.config = this.settings.getConfig();
//     const provider = this.settings.getNextProvider();
//     this.client = new Cerebras({
//       apiKey: provider.key,
//     });
//   }

//   async createCompletion(request: CompletionRequest): Promise<string | AsyncIterable<string>> {
//     if (request.stream) {
//       return this.streamCompletion(request);
//     }
//     const response = await this.client.chat.completions.create({
//       messages: request.messages,
//       model: this.config.model,
//       // model: request.model || 'llama3.1-8b',
//     });

//     return response.choices?.[0]?.message?.content || '';
//   }

//   private async *streamCompletion(request: CompletionRequest): AsyncIterable<string> {
//     const stream = await this.client.chat.completions.create({
//       messages: request.messages,
//       model: this.config.model,
//       // model: request.model || 'llama3.1-8b',
//       stream: true,
//     });

//     for await (const chunk of stream) {
//       yield chunk.choices?.[0]?.delta?.content || '';
//     }
//   }
// }

export { CerebrasLLMClient } from './CerebrasLLMClient';
export { CerebrasLLMClientSingleton } from './CerebrasLLMClientSingleton';
