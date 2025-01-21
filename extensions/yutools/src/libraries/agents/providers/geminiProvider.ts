import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LangChainLLMProvider } from "./langchainProvider";

export class GeminiLlmProvider extends LangChainLLMProvider {
  constructor(apiKey: string, options: any = {}) {
    const llm = new ChatGoogleGenerativeAI({
      apiKey,
      model: options.model || "gemini-pro",
      temperature: options.temperature || 0,
    });
    super(llm);
  }
}