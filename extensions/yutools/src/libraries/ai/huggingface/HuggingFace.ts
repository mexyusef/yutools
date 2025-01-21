import { HfInference } from '@huggingface/inference';
import { huggingfaceSettings } from '../config';

// export interface InferenceRequest {
//   model: string;
//   inputs: string | Record<string, any>;
//   parameters?: Record<string, any>;
// }

// export interface InferenceResponse {
//   generated_text?: string;
//   [key: string]: any;
// }

// async function generateCode(prompt: string) {
//   const hf = new HfInference(huggingfaceSettings.getNextProvider().key);
//   const result = await hf.textGeneration({
//     model: 'mhhmm/typescript-instruct-20k-v2',
//     inputs: prompt,
//     parameters: {
//       max_new_tokens: 100,
//       temperature: 0.5,
//     },
//   });
//   return result.generated_text;
// }
// const prompt = 'Generate an Express.js server setup in TypeScript';
// generateCode(prompt).then(console.log);

// async function* generateCodeStream(prompt: string) {
//   const stream = hf.textGenerationStream({
//     inputs: prompt,
//     parameters: {
//       max_new_tokens: 100,
//       temperature: 0.5,
//     },
//   });
//   for await (const token of stream) {
//     yield token.token.text;
//   }
// }

// const prompt = 'Generate an Express.js server setup in TypeScript';
// for await (const token of generateCodeStream(prompt)) {
//   process.stdout.write(token);
// }

export interface GenerationParameters {
  maxNewTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

export class HuggingFaceService {
  private hf: HfInference;
  // private defaultModel: string;

  constructor() {
    this.hf = new HfInference(huggingfaceSettings.getNextProvider().key);
    // this.defaultModel = huggingfaceSettings.getConfig().model;
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

  // // Set the default model for inference
  // setDefaultModel(model: string): void {
  //   this.defaultModel = model;
  // }

  // // Get the current default model
  // getDefaultModel(): string {
  //   return this.defaultModel;
  // }
}

// // Example usage:
// (async () => {
//   const service = new HuggingFaceService();

//   // Non-streaming example
//   const prompt = 'Generate a TypeScript function to add two numbers';
//   const code = await service.generateText(prompt);
//   console.log('Generated Code:', code);

//   // Streaming example
//   console.log('Streaming Generated Code:');
//   for await (const chunk of service.generateTextStream(prompt)) {
//     process.stdout.write(chunk);
//   }
// })();
