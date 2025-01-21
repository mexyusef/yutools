import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { BaseAgent } from "./baseAgent";
import { BaseTool } from "../tools/baseTool";
import { BaseMemory } from "../interfaces/memory";
import { IGenericLLM } from "../interfaces/genericLLM";
import { GenericLLMAdapter } from "../providers/genericLLMAdapter";

export class PlanAndExecuteAgent extends BaseAgent {
  private executor: PlanAndExecuteAgentExecutor;

  private constructor(executor: PlanAndExecuteAgentExecutor) {
    super();
    this.executor = executor;
  }

  static async create(tools: BaseTool[], memory: BaseMemory, llm: IGenericLLM): Promise<PlanAndExecuteAgent> {
    // Convert BaseTool to LangChain tool
    const langChainTools = tools.map((tool) => tool.toLangChainTool());

    // Convert BaseMemory to LangChain memory
    const langChainMemory = memory.toLangChainMemory();

    // Wrap the IGenericLLM in the adapter
    const adaptedLLM = new GenericLLMAdapter(llm);

    // Create the executor
    const executor = await PlanAndExecuteAgentExecutor.fromLLMAndTools({
      llm: adaptedLLM, // Use the adapted LLM
      tools: langChainTools,
      memory: langChainMemory,
    });

    return new PlanAndExecuteAgent(executor);
  }

  async executeTask(task: string): Promise<any> {
    try {
      const result = await this.executor.call({ input: task });
      return result.output;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Task execution failed: ${error.message}`);
      }
      throw new Error("Task execution failed due to an unknown error.");
    }
  }

}
