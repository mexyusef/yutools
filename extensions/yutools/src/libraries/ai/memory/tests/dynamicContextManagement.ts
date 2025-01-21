import { PersistentMemory } from "../PersistentMemory";

const memory = new PersistentMemory('path/to/database.sqlite', 'conversation_1', 'Project Discussion');

// Step 4.3: Benefits of Dynamic Context Management
// Adaptability:
// The system adapts to different conversation lengths and complexities, ensuring optimal performance.
// Efficiency:
// Reduces token usage for complex conversations by prioritizing recent messages.
// Flexibility:
// Allows for fine-tuning of the sliding window size and summarization frequency based on real-time conversation data.

async function main() {
  // Add messages to the conversation
  await memory.addMessage('user', 'What is TypeScript?');
  await memory.addMessage('assistant', 'TypeScript is a typed superset of JavaScript.');
  await memory.addMessage('user', 'Can you explain its benefits?');
  await memory.addMessage('assistant', 'TypeScript provides static typing, which helps catch errors at compile time.');
  // The system will dynamically adjust the sliding window size based on token usage
}