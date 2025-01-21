import { BaseAgent } from "./baseAgent";
import { LangChainLLMProvider } from "../providers/langchainProvider";
import { LangChainMemory } from "../memory/langchainMemory";
import { LangChainPrompt } from "../prompts/langchainPrompt";

export class LangChainAgent extends BaseAgent {
  private llmProvider: LangChainLLMProvider;
  private memory: LangChainMemory;
  private prompt: LangChainPrompt;

  constructor(llmProvider: LangChainLLMProvider, memory: LangChainMemory, prompt: LangChainPrompt) {
    super();
    this.llmProvider = llmProvider;
    this.memory = memory;
    this.prompt = prompt;
  }

  async executeTask(task: string): Promise<any> {
    try {
      const context = await this.memory.loadMemoryVariables();
      const prompt = await this.prompt.invoke({ ...context, task });
      const { response } = await this.llmProvider.generate(prompt);
      await this.memory.saveContext({ input: task }, { output: response });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Task execution failed: ${error.message}`);
      }
      throw new Error("Task execution failed due to an unknown error.");
    }
  }
}