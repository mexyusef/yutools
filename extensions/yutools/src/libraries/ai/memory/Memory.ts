export interface Memory {
  addMessage(role: 'system' | 'user' | 'assistant', content: string): void;
  getHistory(): Array<{ role: 'system' | 'user' | 'assistant', content: string }>;
  clear(): void;
}