import { BaseTool } from "./baseTool";
import { LangChainLLMProvider } from "../providers/langchainProvider";

export class LLMTool extends BaseTool {
  private llmProvider: LangChainLLMProvider;

  constructor(llmProvider: LangChainLLMProvider) {
    super();
    this.llmProvider = llmProvider;
  }

  async execute(args: { prompt: string; options?: any }): Promise<any> {
    try {
      const { response, message } = await this.llmProvider.generate(args.prompt, args.options);
      return { response, message };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`LLM tool execution failed: ${error.message}`);
      }
      throw new Error("LLM tool execution failed due to an unknown error.");
    }
  }
}