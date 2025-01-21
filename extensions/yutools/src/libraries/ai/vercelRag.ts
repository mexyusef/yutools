import { createClient } from "ai";

// RAG Configuration Interfaces
export interface RAGConfig {
  apiKey: string;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

// RAG Helper Class
export class RAGHelper {
  private client: ReturnType<typeof createClient>;

  constructor(config: RAGConfig) {
    this.client = createClient({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      headers: config.headers,
      fetch: config.fetch,
    });
  }

  /**
   * Ask a question to the RAG-based chatbot.
   * @param question - The user query.
   * @param retrievalOptions - Options for retrieval, such as top-k documents.
   */
  async askQuestion(question: string, retrievalOptions?: { topK?: number }): Promise<string> {
    const response = await this.client.generate({
      prompt: question,
      ...retrievalOptions,
    });
    return response.text;
  }

  /**
   * Add documents to the RAG knowledge base.
   * @param documents - An array of documents to add to the knowledge base.
   */
  async addDocuments(documents: Array<{ id: string; text: string }>): Promise<void> {
    await this.client.addDocuments(documents);
  }

  /**
   * Retrieve documents related to a query from the knowledge base.
   * @param query - The query to search the knowledge base.
   * @param topK - Number of top documents to retrieve.
   */
  async retrieveDocuments(query: string, topK = 5): Promise<Array<{ id: string; text: string }>> {
    const documents = await this.client.retrieve({ query, topK });
    return documents;
  }
}

// Utility Functions
export function createRAGHelper(config: RAGConfig): RAGHelper {
  return new RAGHelper(config);
}

// Example Usage
(async () => {
  const ragHelper = createRAGHelper({
    apiKey: "your-api-key",
    baseURL: "https://your-custom-url.com",
  });

  // Adding documents to the knowledge base
  await ragHelper.addDocuments([
    { id: "doc1", text: "Love is a profound and caring affection towards someone." },
    { id: "doc2", text: "In philosophy, love is a virtue representing human kindness." },
  ]);

  // Retrieve documents
  const docs = await ragHelper.retrieveDocuments("What is love?", 3);
  console.log("Retrieved Documents:", docs);

  // Ask a question
  const answer = await ragHelper.askQuestion("What is love?");
  console.log("Chatbot Answer:", answer);
})();

/**
 * A helper library for building RAG-based chatbots using the Vercel AI SDK.
 */

import { createClient } from "ai";

// RAG Configuration Interfaces
export interface RAGConfig {
  apiKey: string;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}

// RAG Helper Class
export class RAGHelper {
  private client: ReturnType<typeof createClient>;

  constructor(config: RAGConfig) {
    this.client = createClient({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      headers: config.headers,
      fetch: config.fetch,
    });
  }

  /**
   * Ask a question to the RAG-based chatbot.
   * @param question - The user query.
   * @param retrievalOptions - Options for retrieval, such as top-k documents.
   */
  async askQuestion(question: string, retrievalOptions?: { topK?: number }): Promise<string> {
    const response = await this.client.generate({
      prompt: question,
      ...retrievalOptions,
    });
    return response.text;
  }

  /**
   * Add documents to the RAG knowledge base.
   * @param documents - An array of documents to add to the knowledge base.
   */
  async addDocuments(documents: Array<{ id: string; text: string }>): Promise<void> {
    await this.client.addDocuments(documents);
  }

  /**
   * Retrieve documents related to a query from the knowledge base.
   * @param query - The query to search the knowledge base.
   * @param topK - Number of top documents to retrieve.
   */
  async retrieveDocuments(query: string, topK = 5): Promise<Array<{ id: string; text: string }>> {
    const documents = await this.client.retrieve({ query, topK });
    return documents;
  }

  /**
   * Ask a multimodal question to the RAG-based chatbot.
   * @param inputs - Multimodal inputs including text, images, or structured data.
   * @param options - Options for retrieval and model generation.
   */
  async askMultimodalQuestion(
    inputs: {
      text?: string;
      images?: Array<{ url: string; description?: string }>;
      structuredData?: Record<string, any>;
    },
    options?: { topK?: number }
  ): Promise<string> {
    const response = await this.client.generate({
      prompt: inputs.text || "",
      images: inputs.images,
      structuredData: inputs.structuredData,
      ...options,
    });
    return response.text;
  }
}

// Utility Functions
export function createRAGHelper(config: RAGConfig): RAGHelper {
  return new RAGHelper(config);
}

// Example Usage
(async () => {
  const ragHelper = createRAGHelper({
    apiKey: "your-api-key",
    baseURL: "https://your-custom-url.com",
  });

  // Adding documents to the knowledge base
  await ragHelper.addDocuments([
    { id: "doc1", text: "Love is a profound and caring affection towards someone." },
    { id: "doc2", text: "In philosophy, love is a virtue representing human kindness." },
  ]);

  // Retrieve documents
  const docs = await ragHelper.retrieveDocuments("What is love?", 3);
  console.log("Retrieved Documents:", docs);

  // Ask a text-only question
  const answer = await ragHelper.askQuestion("What is love?");
  console.log("Chatbot Answer:", answer);

  // Ask a multimodal question
  const multimodalAnswer = await ragHelper.askMultimodalQuestion(
    {
      text: "Describe this scene.",
      images: [{ url: "https://example.com/image.jpg", description: "A beautiful sunset." }],
      structuredData: { location: "beach", time: "evening" },
    },
    { topK: 3 }
  );
  console.log("Multimodal Chatbot Answer:", multimodalAnswer);
})();
