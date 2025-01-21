import { HfInference } from '@huggingface/inference';
import { huggingfaceSettings } from '../config';

export class HuggingFaceClientSingleton {
  private hf: HfInference;
  private static instance: HuggingFaceClientSingleton | null = null;

  public static getInstance(): HuggingFaceClientSingleton {
    if (!HuggingFaceClientSingleton.instance) {
      HuggingFaceClientSingleton.instance = new HuggingFaceClientSingleton();
    }
    return HuggingFaceClientSingleton.instance;
  }

  private constructor() {
    this.hf = new HfInference(huggingfaceSettings.getNextProvider().key);
  }

  /**
   * Returns the OpenAI client instance.
   * @returns The OpenAI client.
   */
  public getClient(): HfInference {
    return this.hf;
  }

  // Generate text using non-streaming inference
  async generateText(
    prompt: string,
    // model?: string,
    // parameters?: GenerationParameters
  ): Promise<string> {
    const result = await this.hf.textGeneration({
      model: huggingfaceSettings.getConfig().model,
      inputs: prompt,
      parameters: {
        max_new_tokens: huggingfaceSettings.getConfig().maxTokens || 4096,
        temperature: huggingfaceSettings.getConfig().temperature || 0.5,
        // top_p: parameters?.topP || 1.0,
        // top_k: parameters?.topK || 50,
      },
    });
    return result.generated_text;
  }

  // Generate text using streaming inference
  async *generateTextStream(
    prompt: string,
  ): AsyncGenerator<string> {
    const stream = this.hf.textGenerationStream({
      model: huggingfaceSettings.getConfig().model,
      inputs: prompt,
      parameters: {
        max_new_tokens: huggingfaceSettings.getConfig().maxTokens || 4096,
        temperature: huggingfaceSettings.getConfig().temperature || 0.5,
        // top_p: parameters?.topP || 1.0,
        // top_k: parameters?.topK || 50,
      },
    });

    for await (const token of stream) {
      yield token.token.text;
    }
  }

}
