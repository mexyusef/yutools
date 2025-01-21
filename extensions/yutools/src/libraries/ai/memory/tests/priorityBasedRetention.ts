import { PersistentMemory } from "../PersistentMemory";

const memory = new PersistentMemory('path/to/database.sqlite', 'conversation_1', 'Project Discussion');

async function main() {
  // Add messages with different priorities
  await memory.addMessage('user', 'What is TypeScript?'); // High priority
  await memory.addMessage('assistant', 'TypeScript is a typed superset of JavaScript.'); // Low priority
  await memory.addMessage('system', 'You are a helpful assistant.'); // Medium priority

  // The sliding window will retain high-priority messages and summarize low-priority ones
}
