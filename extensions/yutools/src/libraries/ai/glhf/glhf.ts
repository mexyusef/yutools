
export interface GLHFConfig {
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

export {GLHFLLMClient } from './GLHFLLMClient';
export {GLHFLLMClientSingleton } from './GLHFLLMClientSingleton';