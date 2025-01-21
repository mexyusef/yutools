import { BrowserClient } from '../core/BrowserClient';

export async function type(client: BrowserClient, selector: string, text: string) {
  try {
    await client.waitForSelector(selector);
    await client.fill(selector, text);
    console.log(`Typed "${text}" into element: ${selector}`);
  } catch (error) {
    console.error(`Failed to type into element: ${selector}`, error);
    throw error;
  }
}