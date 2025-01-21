// uneh https://claude.ai/chat/622fd56f-a940-40b6-b252-9f5be34d5c49
// hf-inference.ts
import { HfInference } from '@huggingface/inference';
import type { TextGenerationOutput, TextGenerationStreamOutput } from '@huggingface/inference';
import { huggingfaceSettings } from '../config';

// Types for model responses
export interface TextGenerationResponse extends TextGenerationOutput {}

export interface TextGenerationStreamResponse {
  token: {
    text: string;
    id: number;
    logprob: number;
    special: boolean;
  };
  generated_text: string | null;
  details?: any;
}

export interface ImageGenerationResponse {
  blob: Blob;
}

// Configuration interface
export interface HFConfig {
  apiKey: string;
  defaultModel?: string;
  requestTimeout?: number;
}

// Options for text generation
export interface TextGenerationOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  repetitionPenalty?: number;
  stopSequences?: string[];
}

// Main class for HuggingFace inference
export class HFInferenceClient {
  private client: HfInference;
  // private defaultModel: string;

  constructor(
    // config: HFConfig
  ) {
    this.client = new HfInference(
      // config.apiKey
      huggingfaceSettings.getNextProvider().key
    );
    // this.defaultModel = config.defaultModel || 'gpt2';
    // this.defaultModel = huggingfaceSettings.getConfig().model;
    
    // Note: withTimeout is removed as it's not available in the type definitions
  }

  /**
   * Generate text using a language model
   * @param prompt The input prompt
   * @param options Generation options
   * @returns Generated text response
   */
  async generateText(
    prompt: string,
    // options: TextGenerationOptions = {}
  ): Promise<TextGenerationResponse> {
    try {
      // const model = options.model || this.defaultModel;
      const response = await this.client.textGeneration({
        model: huggingfaceSettings.getConfig().model,
        inputs: prompt,
        parameters: {
          max_new_tokens: huggingfaceSettings.getConfig().maxTokens, // options.maxTokens,
          temperature: huggingfaceSettings.getConfig().temperature, // options.temperature,
          // top_p: options.topP,
          // repetition_penalty: options.repetitionPenalty,
          // stop_sequences: options.stopSequences,
        },
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate text with streaming response
   * @param prompt The input prompt
   * @param options Generation options
   * @returns AsyncGenerator for streaming responses
   */
  async *generateTextStream(
    prompt: string,
    // options: TextGenerationOptions = {}
  ): AsyncGenerator<TextGenerationStreamOutput, void, unknown> {
    try {
      // const model = options.model || this.defaultModel;
      const stream = await this.client.textGenerationStream({
        model: huggingfaceSettings.getConfig().model,
        inputs: prompt,
        parameters: {
          max_new_tokens: huggingfaceSettings.getConfig().maxTokens, // options.maxTokens,
          temperature: huggingfaceSettings.getConfig().temperature, // options.temperature,
          // max_new_tokens: options.maxTokens,
          // temperature: options.temperature,
          // top_p: options.topP,
          // repetition_penalty: options.repetitionPenalty,
          // stop_sequences: options.stopSequences,
        },
      });

      for await (const response of stream) {
        yield response;
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate an image from text
   * @param prompt The text prompt
   * @param model Optional model override
   * @returns Generated image as blob
   */
  async generateImage(
    prompt: string,
    // model = 'stabilityai/stable-diffusion-2'
  ): Promise<Blob> {
    try {
      const response = await this.client.textToImage({
        inputs: prompt,
        model: huggingfaceSettings.getConfig().imageGenerationModel,
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors from the HuggingFace API
   */
  private handleError(error: any): Error {
    if (error.response) {
      const { status, statusText } = error.response;
      return new Error(`HuggingFace API Error: ${status} - ${statusText}`);
    }
    return error;
  }
}

// Example usage in a VS Code extension:
/*
import { HFInferenceClient } from './hf-inference';

// In your extension's activate function:
const hf = new HFInferenceClient({
  apiKey: process.env.HUGGINGFACE_API_KEY!,
  defaultModel: 'gpt2',
});

// Non-streaming text generation
const response = await hf.generateText('Hello, how are', {
  maxTokens: 50,
  temperature: 0.7,
});
console.log(response.generated_text);

// Streaming text generation
for await (const chunk of hf.generateTextStream('Tell me a story about', {
  maxTokens: 100,
})) {
  if (chunk.token) {
    process.stdout.write(chunk.token.text);
  }
}

// Image generation
const imageResponse = await hf.generateImage('A beautiful sunset over mountains');
// Handle the blob directly
*/