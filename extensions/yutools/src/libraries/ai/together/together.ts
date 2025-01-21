import OpenAI from 'openai';
import { togetherSettings } from '../config';

export interface TogetherAIConfig {
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

export { TogetherAILLMClient } from './TogetherAILLMClient';
export { TogetherAILLMClientSingleton } from './TogetherAILLMClientSingleton';
