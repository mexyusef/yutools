import { readFileSync } from 'fs';

export function encodeImage(imagePath: string): string {
  const imageBuffer = readFileSync(imagePath);
  return Buffer.from(imageBuffer).toString('base64');
}