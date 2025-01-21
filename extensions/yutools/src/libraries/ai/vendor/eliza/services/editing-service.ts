import OpenAI from "openai";

export class EditingService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async editContent(content: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional editor." },
        { role: "user", content: `Edit this content: ${content}` },
      ],
      max_tokens: 1000,
    });
    return response.choices[0].message.content || "";
  }
}