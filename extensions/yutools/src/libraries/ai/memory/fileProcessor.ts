import { readFileSync } from 'fs';
import pdf from 'pdf-parse'; // For PDF processing
import { createWorker } from 'tesseract.js'; // For OCR (image processing)

// Process a text file
export function processTextFile(filePath: string, chunkSize: number = 1000): string[] {
  const content = readFileSync(filePath, 'utf-8');
  return chunkText(content, chunkSize);
}

// Process a PDF file
export async function processPdfFile(filePath: string, chunkSize: number = 1000): Promise<string[]> {
  const dataBuffer = readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return chunkText(data.text, chunkSize);
}

// Process an image file (OCR)
export async function processImageFile(filePath: string, chunkSize: number = 1000): Promise<string[]> {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(filePath);
  await worker.terminate();
  return chunkText(text, chunkSize);
}

// Helper function to chunk text into smaller parts
function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
