import { BaseLLMProvider, LLMResponse } from "../interfaces/llmProvider";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { HumanMessage, SystemMessage, MessageContent } from "@langchain/core/messages";

export class LangChainLLMProvider implements BaseLLMProvider {
  private llm: BaseLanguageModel;

  constructor(llm: BaseLanguageModel) {
    this.llm = llm;
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