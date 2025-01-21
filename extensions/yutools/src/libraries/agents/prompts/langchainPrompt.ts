import { ChatPromptTemplate } from "@langchain/core/prompts";

export class LangChainPrompt {
  private promptTemplate: ChatPromptTemplate;

  constructor(systemTemplate: string, userTemplate: string) {
    this.promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["user", userTemplate],
    ]);
  }

  async invoke(variables: Record<string, any>): Promise<string> {
    try {
      const promptValue = await this.promptTemplate.invoke(variables);
      return promptValue.toString();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to invoke prompt: ${error.message}`);
      }
      throw new Error("Failed to invoke prompt due to an unknown error.");
    }
  }
}