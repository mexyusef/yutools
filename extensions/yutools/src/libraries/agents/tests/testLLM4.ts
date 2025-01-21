import { CustomTaskPlanner } from "../agents/customTaskPlanner";
import { PlanAndExecuteAgent } from "../agents/planAndExecuteAgent";
import { LangChainMemory } from "../memory/langchainMemory";
import { OpenAILlmProvider } from "../providers";
import { SearchTool } from "../tools";
import { LLMTool } from "../tools/llmTool";

// Initialize the LLM provider
const llmProvider = new OpenAILlmProvider(process.env.OPENAI_API_KEY || '');

// Initialize memory
const memory = new LangChainMemory();

// Initialize tools
const llmTool = new LLMTool(llmProvider);
const searchTool = new SearchTool(process.env.SERPAPI_API_KEY);
const tools = [llmTool, searchTool];

// Initialize the agent (choose one approach)
// Option 1: Use PlanAndExecuteAgent
const planAndExecuteAgent = new PlanAndExecuteAgent(tools, memory, llmProvider);

// Option 2: Use CustomTaskPlanner
const customTaskPlanner = new CustomTaskPlanner(llmProvider, tools, memory);

async function() {
  const task = "Find the latest AI trends and summarize them.";
  const response = await customTaskPlanner.executeTask(task); // or planAndExecuteAgent.executeTask(task)
  console.log(response);
}