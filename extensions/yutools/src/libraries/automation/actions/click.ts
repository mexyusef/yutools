import { BrowserClient } from '../core/BrowserClient';

export async function click(client: BrowserClient, selector: string) {
  try {
    await client.waitForSelector(selector);
    await client.click(selector);
    console.log(`Clicked element: ${selector}`);
  } catch (error) {
    console.error(`Failed to click element: ${selector}`, error);
    throw error;
  }
}