import { GLHFLLMClientWithMemory } from './GLHFLLMClientWithMemory';

const llmClientWithMemory = new GLHFLLMClientWithMemory('chats-glhf.sqlite');

// Example function to chat with the LLM
async function chatWithLLM(userPrompt: string) {
  try {
    const response = await llmClientWithMemory.chat(userPrompt);
    console.log('Assistant:', response);
  } catch (error) {
    console.error('Error during LLM operation:', error);
  }
}

// Start a conversation
chatWithLLM("Hello, how are you?");
chatWithLLM("Can you tell me about TypeScript?");

// Create a snapshot of the first 2 messages
llmClientWithMemory.createSnapshot('Initial greeting', 1, 2);

// Add more messages
chatWithLLM("What are the benefits of using TypeScript?");
chatWithLLM("Can you recommend a good TypeScript tutorial?");

// Create another snapshot of the last 2 messages
llmClientWithMemory.createSnapshot('TypeScript discussion', 3, 4);

// Retrieve all snapshots
const snapshots = llmClientWithMemory.getSnapshots();
console.log('Snapshots:', snapshots);

// Clear the conversation history
llmClientWithMemory.clearHistory();

// Close the database connection
llmClientWithMemory.close();













// // Initialize the LLM client with memory
// const dbPath = 'conversations.sqlite'; // Just a filename
// const llmClientWithMemory = new GLHFLLMClientWithMemory(dbPath);

// Start a new conversation
const conversationId1 = llmClientWithMemory.startConversation('Project Discussion');
console.log('Started conversation with ID:', conversationId1);
async function main() {
  // Chat in the first conversation
  await llmClientWithMemory.chat("Hello, how are you?");
  await llmClientWithMemory.chat("Can you tell me about TypeScript?");

  // Create a snapshot of the first conversation
  llmClientWithMemory.createSnapshot('Initial greeting', 1, 2);

  // Start a second conversation
  const conversationId2 = llmClientWithMemory.startConversation('Weather Chat');
  console.log('Started conversation with ID:', conversationId2);

  // Chat in the second conversation
  await llmClientWithMemory.chat("Hi, what's the weather like today?");
  await llmClientWithMemory.chat("Can you recommend a good movie?");

  // Switch back to the first conversation
  llmClientWithMemory.switchConversation(conversationId1);

  // Continue chatting in the first conversation
  await llmClientWithMemory.chat("What are the benefits of using TypeScript?");

  // Retrieve all conversation IDs
  const allConversationIds = llmClientWithMemory.getAllConversationIds();
  console.log('All conversation IDs:', allConversationIds);

  // Close the current conversation
  llmClientWithMemory.close();
}
main();
