export interface Memory {
  id: string; // Unique identifier for the memory
  content: {
    text: string; // The content of the memory (e.g., a message or action result)
    [key: string]: any; // Additional metadata or structured data
  };
  userId: string; // ID of the user who created the memory
  roomId: string; // ID of the room or context where the memory belongs
  createdAt: Date; // Timestamp when the memory was created
  embedding?: number[]; // Optional embedding for semantic search
}