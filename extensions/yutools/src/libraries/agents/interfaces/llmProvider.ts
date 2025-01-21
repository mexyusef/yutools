import { MessageContent } from "@langchain/core/messages";

// export interface LLMResponse {
//   response: MessageContent; // Allow MessageContent type
//   message: string;
// }
export interface LLMResponse {
  response: string; // Always a string for simplicity
  message: string;
}

export interface BaseLLMProvider {
  generate(prompt: string, options?: any): Promise<LLMResponse>;
  chat(messages: Array<{ role: string; content: string }>, options?: any): Promise<LLMResponse>;
}