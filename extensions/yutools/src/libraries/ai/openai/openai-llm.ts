export interface OpenAIConfig {
  apiKey?: string;
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

export { OpenAILLMClient } from './OpenAILLMClient';
export { OpenAILLMClientSingleton } from './OpenAILLMClientSingleton';
