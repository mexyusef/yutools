import { PersistentMemory } from './PersistentMemory';
import { Table } from '@/libraries/database/sqlite/zendb';
import { IFile, SerializedFile } from './IFile';
import { processImageFile, processPdfFile, processTextFile } from './fileProcessor';
import { Conversation } from './Conversation';

export class PersistentMemoryWithFiles extends PersistentMemory {
  private currentConversationId: string;
  private filesTable: Table<SerializedFile>;

  constructor(
    dbPath: string,
    slidingWindowSize: number = 20,
    // conversationModel: string = 'gpt-3.5-turbo',
    conversationModel: string = 'gpt-4o-mini',
    // conversationId: string,
    // conversationName: string,
  ) {
    let conversationId = '';
    let conversationName = '';
    super(dbPath, conversationId, conversationName, slidingWindowSize, conversationModel);
    this.currentConversationId = '';
    this.filesTable = this.db.table<SerializedFile>('files', {
      id: { type: 'integer', primaryKey: true, autoIncrement: true },
      conversation_id: { type: 'text', required: true },
      name: { type: 'text', required: true },
      type: { type: 'text', required: true },
      size: { type: 'integer', required: true },
      // chunks: { type: 'JSON', required: true },
      chunks: { type: 'text', required: true }, // Store JSON as text
      created_at: { type: 'text', required: true },
    });
  }

  // Factory method to create a new conversation
  static createConversation(
    dbPath: string,
    conversationId: string,
    conversationName: string,
    slidingWindowSize: number = 20,
    conversationModel: string = 'gpt-4o-mini',
  ): PersistentMemoryWithFiles {
    const memory = new PersistentMemoryWithFiles(dbPath, slidingWindowSize, conversationModel);
    memory.currentConversationId = conversationId;
    memory.initializeConversation(conversationName);
    return memory;
  }

  // Create a new conversation
  createConversation(conversationId: string, conversationName: string): void {
    this.currentConversationId = conversationId;
    this.initializeConversation(conversationName);
  }

  // Switch to an existing conversation
  switchConversation(conversationId: string): void {
    const conversation = this.conversationsTable.find().where({ id: conversationId }).first();
    if (conversation) {
      this.currentConversationId = conversationId;
    } else {
      throw new Error(`Conversation with ID ${conversationId} not found.`);
    }
  }

  // Delete a conversation
  deleteConversation(conversationId: string): void {
    this.conversationsTable.delete(conversationId);
    this.messagesTable.find().where({ conversation_id: conversationId }).all().forEach(row => {
      this.messagesTable.delete(row.toObject().id!);
    });
    this.filesTable.find().where({ conversation_id: conversationId }).all().forEach(row => {
      this.filesTable.delete(row.toObject().id!);
    });

    if (this.currentConversationId === conversationId) {
      this.currentConversationId = ''; // Reset current conversation
    }
  }

  // Get all conversations
  getConversations(): Conversation[] {
    return this.conversationsTable.find().all().map(row => row.toObject());
  }

  // Method to set the current conversation
  setCurrentConversation(conversationId: string, conversationName: string): void {
    this.currentConversationId = conversationId;
    this.initializeConversation(conversationName);
  }

  // Ensure all operations are tied to the current conversation
  private ensureConversation(): void {
    if (!this.currentConversationId) {
      throw new Error('No conversation is currently selected.');
    }
  }

  // Override methods to ensure they use the current conversation
  async addMessage(role: 'system' | 'user' | 'assistant', content: string): Promise<void> {
    this.ensureConversation();
    await super.addMessage(role, content);
  }

  getHistory(): Array<{ role: 'system' | 'user' | 'assistant', content: string }> {
    this.ensureConversation();
    return super.getHistory();
  }

  async uploadFile(filePath: string, fileName: string, fileType: 'text' | 'pdf' | 'image'): Promise<void> {
    this.ensureConversation();

    let chunks: string[];

    switch (fileType) {
      case 'text':
        chunks = processTextFile(filePath);
        break;
      case 'pdf':
        chunks = await processPdfFile(filePath);
        break;
      case 'image':
        chunks = await processImageFile(filePath);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    const file: IFile = {
      conversation_id: this.conversationId,
      name: fileName,
      type: fileType,
      size: chunks.join('').length,
      chunks,
      created_at: new Date().toISOString(),
    };

    await this.addFile(file);
  }

  private async addFile(file: IFile): Promise<void> {
    // this.filesTable.insert(file);
    // Serialize the chunks array into a JSON string
    const fileWithSerializedChunks = {
      ...file,
      chunks: JSON.stringify(file.chunks), // Serialize chunks
    };

    // Insert the file into the files table
    this.filesTable.insert(fileWithSerializedChunks);
  }

  // getFiles(): IFile[] {
  //   return this.filesTable.find().where({ conversation_id: this.conversationId }).all().map(row => row.toObject());
  // }
  // Retrieve all files for the current conversation
  getFiles(): IFile[] {
    this.ensureConversation();

    const rows = this.filesTable.find().where({ conversation_id: this.conversationId }).all();

    // Deserialize the chunks field back into an array
    return rows.map(row => {
      const file = row.toObject();
      return {
        ...file,
        chunks: JSON.parse(file.chunks), // Deserialize chunks
      };
    });
  }

}
