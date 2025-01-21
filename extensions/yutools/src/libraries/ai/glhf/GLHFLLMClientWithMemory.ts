import path from 'path';
import { getGlobalStoragePath } from '@/storage';
import { PersistentMemory } from '../memory/PersistentMemory';
import { generateConversationId } from '../utils/generateConversationId';
import { GLHFLLMClientSingleton } from './glhf';

export class GLHFLLMClientWithMemory {
  private llmClient: GLHFLLMClientSingleton;
  private memories: Map<string, PersistentMemory>; // Map of conversationId to PersistentMemory
  private currentConversationId: string | null;
  private dbPath: string;

  // Resolve dbPath to an absolute path if it's just a filename
  private resolveDbPath(dbPath: string): string {
    // Check if dbPath is just a filename (no directory separators)
    if (path.basename(dbPath) === dbPath) {
      // If it's just a filename, prepend it with getGlobalStoragePath()
      return getGlobalStoragePath(dbPath);
    }

    // If dbPath is already an absolute or relative path, return it as-is
    return dbPath;
  }

  constructor(dbPath: string) {
    // Initialize the LLM client
    this.llmClient = GLHFLLMClientSingleton.getInstance();
    // Resolve dbPath to an absolute path if it's just a filename
    this.dbPath = this.resolveDbPath(dbPath);
    // Initialize the map to store multiple conversations
    this.memories = new Map();
    // Track the current conversation
    this.currentConversationId = null;
  }

  // Start a new conversation or switch to an existing one
  startConversation(conversationName?: string, conversationId?: string): string {
    const newConversationId = conversationId || generateConversationId();
    const newConversationName = conversationName || 'Untitled_' + newConversationId;

    // Initialize a new PersistentMemory instance for the conversation
    const memory = new PersistentMemory(this.dbPath, newConversationId, newConversationName);

    // Store the memory in the map
    this.memories.set(newConversationId, memory);

    // Set the current conversation
    this.currentConversationId = newConversationId;

    return newConversationId;
  }

  // Switch to an existing conversation
  switchConversation(conversationId: string): void {
    if (!this.memories.has(conversationId)) {
      throw new Error(`Conversation with ID ${conversationId} does not exist.`);
    }

    // Set the current conversation
    this.currentConversationId = conversationId;
  }

  // Add a message to the current conversation and get a response from the LLM
  async chat(userPrompt: string): Promise<string> {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;

    try {
      // Add the user's message to the memory
      memory.addMessage('user', userPrompt);

      // Get the conversation history
      const history = memory.getHistory();

      // Create the messages array including the system prompt and conversation history
      const messages = [
        { role: 'system' as const, content: 'You are a helpful assistant.' }, // System prompt
        ...history.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant', // Explicitly cast the role
          content: msg.content,
        })),
      ];

      // Query the LLM
      const response = await this.llmClient.createCompletion({ messages, stream: false }) as string;

      // Add the assistant's response to the memory
      memory.addMessage('assistant', response);

      return response;
    } catch (error: any) {
      console.error('Error during LLM operation:', error);
      throw error;
    }
  }

  // Create a snapshot of the current conversation
  createSnapshot(summary: string, rangeStart: number, rangeEnd: number): void {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;
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

  // Close the database connection for the current conversation
  close(): void {
    if (!this.currentConversationId) {
      throw new Error('No conversation is active. Call startConversation() first.');
    }

    const memory = this.memories.get(this.currentConversationId)!;
    memory.close();
  }

  // Get the current conversationId
  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }

  // Get all conversationIds
  getAllConversationIds(): string[] {
    return Array.from(this.memories.keys());
  }

}