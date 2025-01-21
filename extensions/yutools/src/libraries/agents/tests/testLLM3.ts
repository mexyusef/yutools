import { LangChainAgent } from "../agents/langchainAgent";
import { MemoryType } from "../interfaces/memory";
import { MemoryFactory } from "../memory/memoryFactory";
import { LangChainPrompt } from "../prompts/langchainPrompt";
import { OpenAILlmProvider } from "../providers";
import { LangChainMemory } from "../memory/langchainMemory";

// Initialize the LLM provider
const llmProvider = new OpenAILlmProvider(process.env.OPENAI_API_KEY || '');

// Initialize memory (switch between any supported memory type)
const memoryType: MemoryType = "buffer"; // or "conversation-summary", "buffer-window", etc.
const memory = MemoryFactory.createMemory(memoryType, {
  memoryKey: "chat_history", // Example configuration
  // Additional options specific to the memory type
  windowSize: 5, // For BufferWindowMemory
  // vectorStore: someVectorStore, // For VectorStoreRetrieverMemory
  // redisClient: someRedisClient, // For RedisMemory (if added later)
});

// Initialize a prompt template
const prompt = new LangChainPrompt(
  "You are a helpful assistant.",
  "{task}"
);

// Initialize the agent
const agent = new LangChainAgent(llmProvider, memory as LangChainMemory, prompt);

async function main() {
  // Execute a task
  const response = await agent.executeTask("Tell me a joke about cats.");
  console.log(response);

  // Execute another task (memory will include the previous interaction)
  const followUpResponse = await agent.executeTask("Can you make it funnier?");
  console.log(followUpResponse);
}