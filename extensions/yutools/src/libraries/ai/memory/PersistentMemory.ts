import { Table, ZenDB } from '@/libraries/database/sqlite/zendb';
import { Memory } from './Memory'; // Assuming Memory interface is defined elsewhere
import { Conversation } from './Conversation';
import { Message } from './Message';
import { Snapshot } from './Snapshot';
import { conversationsSchema } from './conversationsSchema';
import { messagesSchema } from './messagesSchema';
import { snapshotsSchema } from './snapshotsSchema';
import { countTokens } from './tokenizer';
import { summarizeMessages } from './summarizeMessages';

export class PersistentMemory implements Memory {
  protected db: ZenDB;
  protected conversationsTable: Table<Conversation>;
  protected messagesTable: Table<Message>;
  private snapshotsTable: Table<Snapshot>;
  protected conversationId: string;
  private conversationModel: string;
  private slidingWindowSize: number; // Number of recent messages to retain

  constructor(
    dbPath: string,
    conversationId: string,
    conversationName: string,
    slidingWindowSize: number = 20,
    // conversationModel: string = 'gpt-3.5-turbo',
    conversationModel: string = 'gpt-4o-mini',
  ) {
    // Initialize the database
    this.db = new ZenDB(dbPath);

    // Create or access the tables
    this.conversationsTable = this.db.table<Conversation>('conversations', conversationsSchema);
    this.messagesTable = this.db.table<Message>('messages', messagesSchema);
    this.snapshotsTable = this.db.table<Snapshot>('snapshots', snapshotsSchema);
    this.conversationModel = conversationModel;

    // Set the current conversation ID
    this.conversationId = conversationId;
    // Set the sliding window size
    this.slidingWindowSize = slidingWindowSize;
    // Initialize the conversation if it doesn't exist
    this.initializeConversation(conversationName);
  }

  // Initialize a new conversation if it doesn't exist
  protected initializeConversation(name: string): void {
    const existingConversation = this.conversationsTable.find().where({ id: this.conversationId }).first();
    if (!existingConversation) {
      const timestamp = new Date().toISOString();
      this.conversationsTable.insert({
        id: this.conversationId,
        name,
        created_at: timestamp,
        updated_at: timestamp,
      });
    }
  }

  // // Add a message to the memory
  // addMessage(role: 'system' | 'user' | 'assistant', content: string): void {
  //   const timestamp = new Date().toISOString();
  //   this.messagesTable.insert({ conversation_id: this.conversationId, role, content, timestamp });

  //   // Update the conversation's updated_at timestamp
  //   this.conversationsTable.update(this.conversationId, { updated_at: timestamp });
  // }
  // Add a message to the memory
  async addMessage(role: 'system' | 'user' | 'assistant', content: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const tokens = countTokens(content, this.conversationModel);
    const priority = this.calculatePriority({ role, content, tokens, timestamp } as Message); // Calculate priority

    this.messagesTable.insert({
      conversation_id: this.conversationId,
      role,
      content,
      tokens, // Store the token count
      priority,
      timestamp,
    });

    // Update the conversation's updated_at timestamp
    this.conversationsTable.update(this.conversationId, { updated_at: timestamp });
    // Apply the sliding window logic
    await this.applySlidingWindow();
  }

  // Calculate the priority score for a message
  private calculatePriority(message: Message): number {
    // Assign higher priority to user queries and system responses
    if (message.role === 'user') {
      return 2; // High priority
    } else if (message.role === 'system') {
      return 1; // Medium priority
    } else {
      return 0; // Low priority (assistant responses)
    }
  }

  // Get the total token count for the current conversation
  getTokenCount(): number {
    const rows = this.messagesTable.find().where({ conversation_id: this.conversationId }).all();
    return rows.reduce((total, row) => total + row.toObject().tokens, 0);
  }

  // Dynamically adjust the sliding window size and summarization frequency
  // Adjusts the sliding window size based on the conversation's complexity.
  // For complex conversations (high token usage), the window size is reduced to prioritize recent messages.
  // For simpler conversations, the window size is increased to retain more context.
  private adjustSlidingWindow(): void {
    const { isComplex, tokenUsage } = this.evaluateComplexity();

    // Adjust the sliding window size based on complexity
    if (isComplex) {
      this.slidingWindowSize = 15; // Smaller window for complex conversations
    } else {
      this.slidingWindowSize = 20; // Larger window for simpler conversations
    }

    console.log(`Adjusted sliding window size to ${this.slidingWindowSize} based on token usage (${tokenUsage} tokens).`);
  }

  // Apply the sliding window logic
  // This method checks if the number of messages exceeds the sliding window size.
  // If it does, it summarizes the older messages and creates a snapshot.
  private async applySlidingWindow(): Promise<void> {

    // Adjust the sliding window size based on the conversation's complexity
    // The sliding window size is dynamically adjusted before applying the sliding window logic.
    this.adjustSlidingWindow();

    // Retrieve all messages for the current conversation
    const messages = this.messagesTable.find().where({ conversation_id: this.conversationId }).all();

    // If the number of messages exceeds the sliding window size, summarize older messages
    if (messages.length > this.slidingWindowSize) {

      // Sort messages by priority (highest first)
      const sortedMessages = messages.sort((a, b) => b.toObject().priority - a.toObject().priority);
      // // Retain the highest-priority messages within the window
      // const retainedMessages = sortedMessages.slice(0, this.slidingWindowSize);
      // Messages outside the window
      const olderMessages = sortedMessages.slice(this.slidingWindowSize);

      // const recentMessages = messages.slice(-this.slidingWindowSize); // Retain the most recent messages
      // const olderMessages = messages.slice(0, -this.slidingWindowSize); // Messages outside the window

      // Summarize older messages
      const summary = await summarizeMessages(olderMessages.map(msg => ({
        role: msg.toObject().role,
        content: msg.toObject().content,
      })));

      // Create a snapshot for the summarized messages
      // Summarized messages are stored as snapshots, preserving their context.
      this.createSnapshot(summary, olderMessages[0].toObject().id!, olderMessages[olderMessages.length - 1].toObject().id!);

      // Delete the older messages from the database
      olderMessages.forEach(msg => {
        this.messagesTable.delete(msg.toObject().id!);
      });

    }

  }

  // Get the conversation history for the current conversation
  getHistory(): Array<{ role: 'system' | 'user' | 'assistant', content: string }> {
    const rows = this.messagesTable.find().where({ conversation_id: this.conversationId }).all();
    return rows.map(row => ({
      role: row.toObject().role,
      content: row.toObject().content,
    }));
  }

  // Create a snapshot of the conversation
  createSnapshot(summary: string, rangeStart: number, rangeEnd: number): void {
    const timestamp = new Date().toISOString();
    this.snapshotsTable.insert({
      conversation_id: this.conversationId,
      summary,
      range_start: rangeStart,
      range_end: rangeEnd,
      created_at: timestamp,
    });
  }

  // Get all snapshots for the current conversation
  getSnapshots(): Snapshot[] {
    return this.snapshotsTable.find().where({ conversation_id: this.conversationId }).all().map(row => row.toObject());
  }

  // Evaluate the conversation's complexity
  // Evaluates the conversation's complexity based on token usage.
  // Returns an object with isComplex (boolean) and tokenUsage (number).
  private evaluateComplexity(): { isComplex: boolean, tokenUsage: number } {
    const messages = this.messagesTable.find().where({ conversation_id: this.conversationId }).all();
    const tokenUsage = messages.reduce((total, msg) => total + msg.toObject().tokens, 0);

    // Determine if the conversation is complex based on token usage
    const isComplex = tokenUsage > 2000; // Example threshold for complexity

    return { isComplex, tokenUsage };
  }

  // Clear the conversation history for the current conversation
  clear(): void {
    this.messagesTable.find().where({ conversation_id: this.conversationId }).all().forEach(row => {
      this.messagesTable.delete(row.toObject().id!);
    });
  }

  // Close the database connection
  close(): void {
    this.db.close();
  }

}