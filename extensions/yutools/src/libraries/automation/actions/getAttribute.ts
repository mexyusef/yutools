import { BrowserClient } from '../core/BrowserClient';

export async function getAttribute(client: BrowserClient, selector: string, attribute: string): Promise<string | null> {
  try {
    await client.waitForSelector(selector);
    const value = await client.page!.getAttribute(selector, attribute);
    console.log(`Attribute "${attribute}" from element ${selector}: ${value}`);
    return value;
  } catch (error) {
    console.error(`Failed to get attribute from element: ${selector}`, error);
    throw error;
  }
}