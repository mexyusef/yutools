import { HfInference } from '@huggingface/inference';
import fs from 'fs';
import fetch from 'node-fetch';
import { huggingfaceSettings } from '../config';

// // Initialize Hugging Face Inference client
// const hf = new HfInference('YOUR_HUGGING_FACE_API_KEY');

// ========================
// Core Library
// ========================

class HuggingFaceClient {
  private hf: HfInference;

  constructor() {
    this.hf = new HfInference(
      huggingfaceSettings.getNextProvider().key
    );
  }

  // ========================
  // Image Generation
  // ========================

  /**
   * Generate an image from a text prompt.
   * @param prompt - The text prompt for image generation.
   * @param model - The model to use (default: 'black-forest-labs/FLUX.1-dev').
   * @returns A Blob containing the generated image.
   */
  async generateImage(
    prompt: string,
    // https://huggingface.co/models?pipeline_tag=text-to-image&sort=trending
    model: string = 'black-forest-labs/FLUX.1-dev'
  ): Promise<Blob> {
    try {
      const result = await this.hf.textToImage({
        model,
        inputs: prompt,
      });
      return result;
    } catch (error: any) {
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  // ========================
  // Image to Text
  // ========================

  /**
   * Generate a text description of an image.
   * @param image - The image as a Blob, URL, or file path.
   * @param model - The model to use (default: 'nlpconnect/vit-gpt2-image-captioning').
   * @returns The generated text description.
   */
  async imageToText(
    image: Blob | string,
    model: string = 'nlpconnect/vit-gpt2-image-captioning'
  ): Promise<string> {
    try {
      const imageBuffer = await this.resolveImage(image);
      const result = await this.hf.imageToText({
        data: imageBuffer,
        model,
      });
      return result.generated_text;
    } catch (error: any) {
      throw new Error(`Image to text conversion failed: ${error.message}`);
    }
  }

  // ========================
  // Image to Image
  // ========================

  /**
   * Transform an image based on a prompt.
   * @param image - The image as a Blob, URL, or file path.
   * @param prompt - The transformation prompt.
   * @param model - The model to use (default: 'lllyasviel/sd-controlnet-depth').
   * @returns A Blob containing the transformed image.
   */
  async transformImage(
    image: Blob | string,
    prompt: string,
    model: string = 'lllyasviel/sd-controlnet-depth'
  ): Promise<Blob> {
    try {
      const imageBuffer = await this.resolveImage(image);
      const result = await this.hf.imageToImage({
        inputs: imageBuffer,
        parameters: { prompt },
        model,
      });
      return result;
    } catch (error: any) {
      throw new Error(`Image transformation failed: ${error.message}`);
    }
  }

  // ========================
  // Visual Question Answering
  // ========================

  /**
   * Answer a question about an image.
   * @param image - The image as a Blob, URL, or file path.
   * @param question - The question to ask about the image.
   * @param model - The model to use (default: 'dandelin/vilt-b32-finetuned-vqa').
   * @returns The answer to the question.
   */
  async visualQuestionAnswering(
    image: Blob | string,
    question: string,
    model: string = 'dandelin/vilt-b32-finetuned-vqa'
  ): Promise<string> {
    try {
      const imageBuffer = await this.resolveImage(image);
      const result = await this.hf.visualQuestionAnswering({
        model,
        inputs: {
          question,
          image: imageBuffer,
        },
      });
      return result.answer;
    } catch (error: any) {
      throw new Error(`Visual question answering failed: ${error.message}`);
    }
  }

  // ========================
  // Document Question Answering
  // ========================

  /**
   * Answer a question about a document image.
   * @param image - The document image as a Blob, URL, or file path.
   * @param question - The question to ask about the document.
   * @param model - The model to use (default: 'impira/layoutlm-document-qa').
   * @returns The answer to the question.
   */
  async documentQuestionAnswering(
    image: Blob | string,
    question: string,
    model: string = 'impira/layoutlm-document-qa'
  ): Promise<string> {
    try {
      const imageBuffer = await this.resolveImage(image);
      const result = await this.hf.documentQuestionAnswering({
        model,
        inputs: {
          question,
          image: imageBuffer,
        },
      });
      return result.answer;
    } catch (error: any) {
      throw new Error(`Document question answering failed: ${error.message}`);
    }
  }

  // ========================
  // Helper Methods
  // ========================

  /**
   * Resolve an image from a Blob, URL, or file path.
   * @param image - The image as a Blob, URL, or file path.
   * @returns An ArrayBuffer or Buffer representing the image.
   */
  private async resolveImage(image: Blob | string): Promise<ArrayBuffer | Buffer> {
    if (typeof image === 'string') {
      if (image.startsWith('http')) {
        const response = await fetch(image);
        return response.arrayBuffer();
      } else {
        return fs.readFileSync(image);
      }
    }
    return image.arrayBuffer();
  }
}

// ========================
// Export the Library
// ========================

export { HuggingFaceClient };