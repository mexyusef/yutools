import { ChatAnthropic } from "@langchain/anthropic";
import { LangChainLLMProvider } from "./langchainProvider";

export class AnthropicLlmProvider extends LangChainLLMProvider {
  constructor(apiKey: string, options: any = {}) {
    const llm = new ChatAnthropic({
      anthropicApiKey: apiKey,
      model: options.model || "claude-2",
      temperature: options.temperature || 0,
    });
    super(llm);
  }
}