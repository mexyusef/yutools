export interface Snapshot {
  id?: number; // Auto-incremented ID
  conversation_id: string; // Foreign key referencing conversations.id
  summary: string; // Compressed summary of the conversation
  range_start: number; // Starting index of the message range
  range_end: number; // Ending index of the message range
  created_at: string; // Timestamp when the snapshot was created
}