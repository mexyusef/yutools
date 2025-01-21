import { Memory } from './Memory';

export class SimpleMemory implements Memory {
  private history: Array<{ role: 'system' | 'user' | 'assistant', content: string }> = [];

  addMessage(role: 'system' | 'user' | 'assistant', content: string): void {
    this.history.push({ role, content });
  }

  getHistory(): Array<{ role: 'system' | 'user' | 'assistant', content: string }> {
    return this.history;
  }

  setMessage(index: number, role: 'system' | 'user' | 'assistant', content: string): void {
    if (index < 0 || index >= this.history.length) {
      throw new Error(`Index ${index} is out of bounds for history length ${this.history.length}`);
    }
    this.history[index] = { role, content };
  }

  clear(): void {
    this.history = [];
  }
}