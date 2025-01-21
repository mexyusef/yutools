import { createClient } from "ai";

// Multimodal Configuration Interfaces
export interface MultimodalConfig {
  apiKey: string;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

// Input types for multimodal interactions
export interface MultimodalInputs {
  text?: string;
  images?: Array<{ url: string; description?: string }>;
  structuredData?: Record<string, any>;
}

// Multimodal Helper Class
export class MultimodalHelper {
  private client: ReturnType<typeof createClient>;

  constructor(config: MultimodalConfig) {
    this.client = createClient({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      headers: config.headers,
      fetch: config.fetch,
    });
  }

  /**
   * Ask a question using multimodal inputs (text, images, structured data).
   * @param inputs - Multimodal inputs for the chatbot.
   * @param options - Additional options like top-k document retrieval.
   */
  async ask(inputs: MultimodalInputs, options?: { topK?: number }): Promise<string> {
    const response = await this.client.generate({
      prompt: inputs.text || "",
      images: inputs.images,
      structuredData: inputs.structuredData,
      ...options,
    });
    return response.text;
  }

  /**
   * Retrieve documents related to a multimodal query.
   * @param inputs - Multimodal inputs for document retrieval.
   * @param topK - Number of top documents to retrieve.
   */
  async retrieve(inputs: MultimodalInputs, topK = 5): Promise<Array<{ id: string; text: string }>> {
    const documents = await this.client.retrieve({
      prompt: inputs.text || "",
      images: inputs.images,
      structuredData: inputs.structuredData,
      topK,
    });
    return documents;
  }
}

// Utility Functions
export function createMultimodalHelper(config: MultimodalConfig): MultimodalHelper {
  return new MultimodalHelper(config);
}

(async () => {
  const multimodalHelper = createMultimodalHelper({
    apiKey: "your-api-key",
    baseURL: "https://your-custom-url.com",
  });

  // Ask a question using text and images
  const answer = await multimodalHelper.ask({
    text: "What does this image represent?",
    images: [{ url: "https://example.com/sunset.jpg", description: "A sunset over the ocean." }],
  });
  console.log("Chatbot Answer:", answer);

  // Retrieve documents using multimodal inputs
  const documents = await multimodalHelper.retrieve(
    {
      text: "Tell me about sunsets.",
      images: [{ url: "https://example.com/sunset.jpg", description: "A sunset." }],
    },
    3
  );
  console.log("Retrieved Documents:", documents);
})();

