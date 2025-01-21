import { ChatCohere } from "@langchain/cohere";
import { LangChainLLMProvider } from "./langchainProvider";

export class CohereLlmProvider extends LangChainLLMProvider {
  constructor(apiKey: string, options: any = {}) {
    const llm = new ChatCohere({
      apiKey,
      model: options.model || "command-nightly",
      temperature: options.temperature || 0,
    });
    super(llm);
  }
}