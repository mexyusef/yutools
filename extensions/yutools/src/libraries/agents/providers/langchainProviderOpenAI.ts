import { ChatOpenAI } from "@langchain/openai";
import { BaseLLMProvider, LLMResponse } from "../interfaces/llmProvider";
import { HumanMessage, MessageContent, SystemMessage } from "@langchain/core/messages";

export class LangChainLLMProviderOpenAI implements BaseLLMProvider {
  private llm: ChatOpenAI;

  constructor(apiKey: string, options: any = {}) {
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      model: options.model || "gpt-4",
      temperature: options.temperature || 0,
    });
  }

  private convertMessageContentToString(content: MessageContent): string {
    if (typeof content === "string") {
      return content;
    } else if (Array.isArray(content)) {
      // Handle MessageContentComplex array (e.g., text, images, etc.)
      return content
        .map((item) => {
          if (item.type === "text") {
            return item.text;
          }
          return ""; // Ignore non-text content for now
        })
        .join(" ");
    }
    return ""; // Fallback for unexpected types
  }
  
  async generate(prompt: string, options?: any): Promise<LLMResponse> {
    try {
      const response = await this.llm.invoke(prompt);
      // return { response: response.content, message: "LLM response generated successfully." };
      const responseContent = this.convertMessageContentToString(response.content);
      return { response: responseContent, message: "LLM response generated successfully." };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate LLM response: ${error.message}`);
      }
      throw new Error("Failed to generate LLM response due to an unknown error.");
    }
  }

  async chat(messages: Array<{ role: string; content: string }>, options?: any): Promise<LLMResponse> {
    try {
      const langchainMessages = messages.map((msg) =>
        msg.role === "system" ? new SystemMessage(msg.content) : new HumanMessage(msg.content)
      );
      const response = await this.llm.invoke(langchainMessages);
      // return { response: response.content, message: "Chat response generated successfully." };
      const responseContent = this.convertMessageContentToString(response.content);
      return { response: responseContent, message: "Chat response generated successfully." };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate chat response: ${error.message}`);
      }
      throw new Error("Failed to generate chat response due to an unknown error.");
    }
  }
}