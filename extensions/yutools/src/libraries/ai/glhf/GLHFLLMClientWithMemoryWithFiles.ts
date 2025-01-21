import path from 'path';
import { getGlobalStoragePath } from '@/storage';
import { PersistentMemoryWithFiles } from '../memory/PersistentMemoryWithFiles';
import { generateConversationId } from '../utils/generateConversationId';
import { GLHFLLMClientSingleton } from './glhf';
import { IFile } from '../memory/IFile';

export class GLHFLLMClientWithMemoryWithFiles {
  private llmClient: GLHFLLMClientSingleton;
  private memories: Map<string, PersistentMemoryWithFiles>; // Map of conversationId to PersistentMemoryWithFiles
  private currentConversationId: string | null;
  private dbPath: string;

  private resolveDbPath(dbPath: string): string {
    if (path.basename(dbPath) === dbPath) {
      return getGlobalStoragePath(dbPath);
    }
    return dbPath;
  }

  constructor(dbPath: string) {
    this.llmClient = GLHFLLMClientSingleton.getInstance();
    this.dbPath = this.resolveDbPath(dbPath);
    this.memories = new Map();
    this.currentConversationId = null;
  }

  close(): void {
    // Close all conversations
    for (const memory of this.memories.values()) {
      memory.close();
    }

    // Clear the memories map
    this.memories.clear();

    // Reset the current conversation ID
    this.currentConversationId = null;
  }

  startConversation(conversationName?: string, conversationId?: string): string {
    const newConversationId = conversationId || generateConversationId();
    const newConversationName = conversationName || 'Untitled_' + newConversationId;

    const memory = new PersistentMemoryWithFiles(this.dbPath);
    memory.setCurrentConversation(newConversationId, newConversationName);
    // // Use the factory method to create a new conversation
    // const memory = PersistentMemoryWithFiles.createConversation(
    //   this.dbPath,
    //   newConversationId,
    //   newConversationName,
    // );
    this.memories.set(newConversationId, memory);
    this.currentConversationId = newConversationId;

    return newConversationId;
  }

  switchConversation(conversationId: string): void {
    if (!this.memories.has(conversationId)) {
      throw new Error(`Conversation with ID ${conversationId} does not exist.`);
    }
    this.currentConversationId = conversationId;
  }

  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }

  async chat(userPrompt: string): Promise<string> {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;

    try {
      await memory.addMessage('user', userPrompt);
      const history = memory.getHistory();

      const messages = [
        { role: 'system' as const, content: 'You are a helpful assistant.' },
        ...history.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
        })),
      ];

      const response = await this.llmClient.createCompletion({ messages, stream: false }) as string;
      await memory.addMessage('assistant', response);

      return response;
    } catch (error: any) {
      console.error('Error during LLM operation:', error);
      throw error;
    }
  }

  async uploadFile(filePath: string, fileName: string, fileType: 'text' | 'pdf' | 'image'): Promise<void> {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;
    await memory.uploadFile(filePath, fileName, fileType);
  }

  getFiles(): IFile[] {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;
    return memory.getFiles();
  }

  getHistory(): Array<{ role: 'system' | 'user' | 'assistant', content: string }> {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;
    return memory.getHistory();
  }

  // Get all conversation IDs
  getAllConversationIds(): string[] {
    return Array.from(this.memories.keys());
  }

  // Create a snapshot of the current conversation
  /**
   * Creates a snapshot of the current conversation.
   * @param summary A brief description of the snapshot.
   * @param rangeStart The starting index of the conversation history to include in the snapshot.
   * @param rangeEnd The ending index of the conversation history to include in the snapshot.
   * @throws Error if no conversation is active or if the range is invalid.
   */
  createSnapshot(summary: string, rangeStart: number, rangeEnd: number): void {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;

    // Validate the range
    const history = memory.getHistory();
    if (rangeStart < 0 || rangeEnd >= history.length || rangeStart > rangeEnd) {
      throw new Error('Invalid range for snapshot.');
    }

    memory.createSnapshot(summary, rangeStart, rangeEnd);
  }

  // Get all snapshots for the current conversation
  getSnapshots(): { summary: string; rangeStart: number; rangeEnd: number }[] {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;
    const snapshots = memory.getSnapshots();
    return snapshots.map(snapshot => ({
      summary: snapshot.summary,
      rangeStart: snapshot.range_start,
      rangeEnd: snapshot.range_end,
    }));
  }

  // Clear the current conversation history
  clearHistory(): void {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;
    memory.clear();
  }

}