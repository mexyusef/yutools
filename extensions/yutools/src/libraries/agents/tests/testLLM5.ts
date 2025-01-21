import { BufferMemory } from "langchain/memory";
import { LangChainMemory } from "../memory/langchainMemory";
import { OpenAILlmProvider } from "../providers";
import { ChatOpenAI } from "@langchain/openai";
import { LLMTool } from "../tools/llmTool";
import { PlanAndExecuteAgent } from "../agents/planAndExecuteAgent";
import { SearchToolSerpAPI, SearchTool, SearchTool2 } from "../tools/searchTool";
import { OpenAIAdapter } from "../providers/OpenAIAdapter";

async function main() {
  // Initialize the LLM provider
  // const llmProvider = new OpenAILlmProvider(process.env.OPENAI_API_KEY ||'');
  const chatOpenAI = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  // Wrap the ChatOpenAI instance in the OpenAI adapter
  const openAIAdapter = new OpenAIAdapter(chatOpenAI);

  // Initialize memory
  const memory = new LangChainMemory(new BufferMemory({ memoryKey: "chat_history" }));

  // Initialize tools
  const llmTool = new LLMTool(llmProvider);
  const searchTool = new SearchToolSerpAPI(process.env.SERPAPI_API_KEY || '');
  const tools = [llmTool, searchTool];

  // Initialize the agent
  const agent = await PlanAndExecuteAgent.create(tools, memory, llmProvider);

  // Execute a task
  const task = "Find the latest AI trends and summarize them.";
  const response = await agent.executeTask(task);
  console.log(response);
}

main().catch((error) => console.error(error));