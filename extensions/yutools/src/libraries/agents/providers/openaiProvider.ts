import { ChatOpenAI } from "@langchain/openai";
import { LangChainLLMProvider } from "./langchainProvider";

export class OpenAILlmProvider extends LangChainLLMProvider {
  constructor(apiKey: string, options: any = {}) {
    const llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      model: options.model || "gpt-4",
      temperature: options.temperature || 0,
    });
    super(llm);
  }
}