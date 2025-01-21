import { LangChainAgent } from "../agents/langchainAgent";
import { LangChainMemory } from "../memory/langchainMemory";
import { MemoryFactory } from "../memory/memoryFactory";
import { LangChainPrompt } from "../prompts/langchainPrompt";
import { AnthropicLlmProvider } from "../providers/anthropicProvider";
import { CohereLlmProvider } from "../providers/cohereProvider";
import { GeminiLlmProvider } from "../providers/geminiProvider";
import { OpenAILlmProvider } from "../providers/openaiProvider";


// Initialize the LLM provider
const llmProvider = new OpenAILlmProvider(process.env.OPENAI_API_KEY || '');

// Initialize memory
// const memory = new LangChainMemory();
// const memoryType: MemoryType = "buffer"; // or "conversation-summary"
const memory = MemoryFactory.createMemory('buffer', { memoryKey: "chat_history", });


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


  const openaiProvider = new OpenAILlmProvider(process.env.OPENAI_API_KEY || '');
  const openaiResponse = await openaiProvider.generate("Hello, OpenAI!");
  console.log(openaiResponse);

  // Use Gemini
  const geminiProvider = new GeminiLlmProvider(process.env.GEMINI_API_KEY || '');
  const geminiResponse = await geminiProvider.generate("Hello, Gemini!");
  console.log(geminiResponse);

  // Use Anthropic
  const anthropicProvider = new AnthropicLlmProvider(process.env.ANTHROPIC_API_KEY || '');
  const anthropicResponse = await anthropicProvider.generate("Hello, Claude!");
  console.log(anthropicResponse);

  // Use Cohere
  const cohereProvider = new CohereLlmProvider(process.env.COHERE_API_KEY || '');
  const cohereResponse = await cohereProvider.generate("Hello, Cohere!");
  console.log(cohereResponse);
}
