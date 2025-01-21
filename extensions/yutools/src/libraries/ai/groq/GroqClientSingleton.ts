import Groq from 'groq-sdk';
import { groqSettings, LLMConfig } from '../config';

class GroqClientSingleton {
  private client: Groq;
  private config: LLMConfig;
  private static instance: GroqClientSingleton | null = null;

  public static getInstance(): GroqClientSingleton {
    if (!GroqClientSingleton.instance) {
      GroqClientSingleton.instance = new GroqClientSingleton();
    }
    return GroqClientSingleton.instance;
  }

  private constructor() {
    this.client = new Groq({ 
      apiKey: groqSettings.getNextProvider().key
    });
    this.config = groqSettings.getConfig();
  }

  updateKey(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

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

export default GroqClientSingleton;
