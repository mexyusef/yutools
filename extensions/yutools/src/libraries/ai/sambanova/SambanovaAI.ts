export interface SambanovaConfig {
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

export { SambanovaLLMClient } from './SambanovaLLMClient';
export { SambanovaLLMClientSingleton } from './SambanovaLLMClientSingleton';
