export interface IFile {
  id?: number;
  conversation_id: string; // Link to the conversation
  name: string; // File name
  type: 'text' | 'pdf' | 'image'; // File type
  size: number; // File size in bytes
  chunks: string[]; // Extracted chunks of content
  created_at: string; // Timestamp
}

// Define a type for the serialized file object (used for database operations)
export interface SerializedFile {
  id?: number;
  conversation_id: string;
  name: string;
  type: 'text' | 'pdf' | 'image';
  size: number;
  chunks: string; // Serialized JSON string
  created_at: string;
}
