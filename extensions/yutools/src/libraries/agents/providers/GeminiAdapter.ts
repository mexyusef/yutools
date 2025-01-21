import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // Hypothetical import for Gemini
import { IGenericLLM } from "../interfaces/genericLLM";
import { MessageContent } from "@langchain/core/messages";

export class GeminiAdapter implements IGenericLLM {
  private chatGemini: ChatGoogleGenerativeAI;

  constructor(chatGemini: ChatGoogleGenerativeAI) {
    this.chatGemini = chatGemini;
  }

  async invoke(messages: { role: string; content: string }[]): Promise<{ content: string }> {
    const response = await this.chatGemini.invoke(messages);
    const content = this.formatContent(response.content);
    return { content };
  }

  private formatContent(content: MessageContent): string {
    if (typeof content === "string") {
      return content;
    } else if (Array.isArray(content)) {
      // Handle complex content (e.g., arrays of MessageContentComplex)
      return content
        .map((item) => {
          if (typeof item === "string") {
            return item;
          } else if ("text" in item) {
            return item.text;
          } else if ("image_url" in item) {
            return item.image_url.url; // Handle image URLs if needed
          }
          return ""; // Fallback for unsupported types
        })
        .join("\n");
    }
    return ""; // Fallback for unsupported types
  }
}