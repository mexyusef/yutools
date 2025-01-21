import { LangChainAgent } from "../agents/langchainAgent";
import { MemoryType } from "../interfaces/memory";
import { LangChainMemory } from "../memory/langchainMemory";
import { MemoryFactory } from "../memory/memoryFactory";
import { LangChainPrompt } from "../prompts/langchainPrompt";
import { OpenAILlmProvider } from "../providers";

// Initialize the LLM provider
const llmProvider = new OpenAILlmProvider(process.env.OPENAI_API_KEY || '');


// Step 5: Benefits of This Approach
// Flexibility: You can easily switch between memory types by changing a single configuration value.

// Extensibility: Adding new memory types is as simple as updating the MemoryFactory.

// Decoupling: The LangChainMemory class is no longer tied to a specific memory implementation.

// Consistency: All memory types adhere to the BaseMemory interface, ensuring consistent behavior.

// Initialize memory (switch between "buffer" and "conversation-summary")
const memoryType: MemoryType = "buffer"; // or "conversation-summary"
const memory = MemoryFactory.createMemory(memoryType, {
  memoryKey: "chat_history", // Example configuration
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
