import { ChatOpenAI } from "@langchain/openai";
import { PlanAndExecuteAgent } from "../agents/planAndExecuteAgent";
import { OpenAIAdapter } from "../providers/OpenAIAdapter";
import { BaseTool } from "../tools";
import { BaseMemory } from "@langchain/core/memory";
import { InputValues, } from "@langchain/core/utils/types";

// Define OutputValues locally if not available from LangChain
type OutputValues = Record<string, any>;

export class SimpleMemory implements BaseMemory {
  private memory: Record<string, any> = {};
  memoryKeys: string[] = []; // Required by BaseMemory

  async loadMemoryVariables(): Promise<Record<string, any>> {
    // Load memory variables (no input arguments expected)
    return this.memory;
  }

  async saveContext(inputValues: InputValues, outputValues: OutputValues): Promise<void> {
    // Save context to memory
    const inputKey = JSON.stringify(inputValues);
    this.memory[inputKey] = outputValues;
  }

  toLangChainMemory(): BaseMemory {
    // Return a new instance of SimpleMemory (or another BaseMemory implementation)
    return new SimpleMemory();
  }
}

export class ExampleTool extends BaseTool {
  constructor() {
    // super("exampleTool"); // Tool name
    super();
  }

  async execute({ input }: { input: string }): Promise<string> {
    // Simulate some processing
    return `Processed: ${input}`;
  }

  canHandle(input: string): boolean {
    // This tool can handle any input containing the word "example"
    return input.toLowerCase().includes("example");
  }
}

async function main() {
  // Initialize the LLM (ChatOpenAI)
  const chatOpenAI = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  // Wrap the ChatOpenAI instance in the OpenAI adapter
  const openAIAdapter = new OpenAIAdapter(chatOpenAI);

  // Initialize tools
  const exampleTool = new ExampleTool();
  const tools: BaseTool[] = [exampleTool];

  // Initialize memory
  const memory = new SimpleMemory();

  // Create an instance of PlanAndExecuteAgent
  const agent = await PlanAndExecuteAgent.create(tools, memory, openAIAdapter);

  // Define a task
  const task = "Break down this example task into smaller steps and process it.";

  // Execute the task
  try {
    const result = await agent.executeTask(task);
    console.log("Task Execution Result:", result);
  } catch (error) {
    console.error("Error executing task:", error);
  }
}

// Run the example
main();
