import { BrowserClient } from '../core/BrowserClient';

export async function uploadFile(client: BrowserClient, selector: string, filePath: string) {
  try {
    await client.waitForSelector(selector);
    await client.page!.setInputFiles(selector, filePath);
    console.log(`Uploaded file: ${filePath} to element: ${selector}`);
  } catch (error) {
    console.error(`Failed to upload file to element: ${selector}`, error);
    throw error;
  }
}