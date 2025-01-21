import { ModelProvider } from "../types/model";

/**
 * Generates an embedding for a given text using a model provider.
 */
export async function generateEmbedding(
  text: string,
  modelProvider: ModelProvider
): Promise<number[]> {
  return modelProvider.generateEmbedding(text);
}

/**
 * Computes the cosine similarity between two embeddings.
 */
export function cosineSimilarity(embeddingA: number[], embeddingB: number[]): number {
  if (embeddingA.length !== embeddingB.length) {
    throw new Error("Embeddings must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < embeddingA.length; i++) {
    dotProduct += embeddingA[i] * embeddingB[i];
    magnitudeA += embeddingA[i] * embeddingA[i];
    magnitudeB += embeddingB[i] * embeddingB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  return dotProduct / (magnitudeA * magnitudeB);
}