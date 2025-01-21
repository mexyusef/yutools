// src/services/code-service.ts
import OpenAI from "openai";

export class CodeService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateCode(task: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4", // Use "gpt-4" or "gpt-3.5-turbo"
      messages: [
        {
          role: "user",
          content: `Write code for: ${task}`,
        },
      ],
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "";
  }
}