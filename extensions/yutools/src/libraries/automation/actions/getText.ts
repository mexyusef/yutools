import { BrowserClient } from '../core/BrowserClient';

export async function getText(client: BrowserClient, selector: string): Promise<string> {
  try {
    await client.waitForSelector(selector);
    const text = await client.page!.textContent(selector);
    console.log(`Text from element ${selector}: ${text}`);
    return text || '';
  } catch (error) {
    console.error(`Failed to get text from element: ${selector}`, error);
    throw error;
  }
}