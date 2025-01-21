export interface IGenericLLM {
  invoke(messages: { role: string; content: string }[]): Promise<{ content: string }>;
}