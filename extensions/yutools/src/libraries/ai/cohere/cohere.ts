// import { CohereClientV2 } from 'cohere-ai';
// import { CohereSettings, cohereSettings, LLMConfig } from '../config';
// hayya overlook_violet971@simplelogin.com
// https://dashboard.cohere.com/api-keys

export interface CohereConfig {
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

export { CohereLLMClient } from './CohereLLMClient';
export { CohereLLMClientSingleton } from './CohereLLMClientSingleton';
