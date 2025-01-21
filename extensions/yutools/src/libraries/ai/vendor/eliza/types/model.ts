export interface ModelProvider {
  generateText(prompt: string): Promise<string>; // Generate text using the model
  generateEmbedding(text: string): Promise<number[]>; // Generate embeddings using the model
}