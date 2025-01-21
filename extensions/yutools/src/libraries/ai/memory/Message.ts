// export interface Message {
//   id?: number; // Auto-incremented ID
//   conversation_id: string; // Foreign key referencing conversations.id
//   role: 'system' | 'user' | 'assistant';
//   content: string;
//   timestamp: string;
// }
export interface Message {
  id?: number;
  conversation_id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  tokens: number;
  priority: number;
  timestamp: string;
}