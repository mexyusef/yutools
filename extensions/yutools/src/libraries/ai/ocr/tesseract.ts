import Tesseract from 'tesseract.js';
// import { readFileSync } from 'fs';

export async function ocrByTesseract(imagePath: string): Promise<string> {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    return text;
}