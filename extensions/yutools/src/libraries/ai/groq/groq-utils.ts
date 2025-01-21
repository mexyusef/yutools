import Groq from 'groq-sdk';
import { groqSettings, LLMConfig } from '../config';

// https://github.com/groq/groq-typescript

// interface GroqConfig {
//   model: string;
//   temperature: number;
//   systemPrompt: string;
//   stream: boolean;
// }

class GroqClient {
  private client: Groq;
  // private config: GroqConfig;
  private config: LLMConfig;

  // constructor(apiKey: string, config: Partial<GroqConfig> = {}) {
  constructor(
    // apiKey: string,
    // config: Partial<LLMConfig> = {}
  ) {
    this.client = new Groq({ 
      apiKey: groqSettings.getNextProvider().key
    });
    this.config = groqSettings.getConfig();
  }

  updateKey(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  // updateSettings(newConfig: Partial<GroqConfig>) {
  //   this.config = { ...this.config, ...newConfig };
  // }

  async sendPrompt(prompt: string) {
    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: this.config.systemPrompt as string },
      { role: 'user', content: prompt },
    ];

    try {
      const response = await this.client.chat.completions.create({
        messages,
        model: this.config.model,
        temperature: this.config.temperature,
        stream: false,
      });
      return response.choices[0]?.message?.content || '';
    } catch (err) {
      console.error('Error sending prompt:', err);
      throw err;
    }
  }

  async streamPrompt(prompt: string, onData: (data: string) => void) {
    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: this.config.systemPrompt as string },
      { role: 'user', content: prompt },
    ];

    try {
      const stream = await this.client.chat.completions.create({
        messages,
        model: this.config.model,
        temperature: this.config.temperature,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        onData(content);
      }
    } catch (err) {
      console.error('Error streaming prompt:', err);
      throw err;
    }
  }
}

export default GroqClient;
