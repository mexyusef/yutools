import { BrowserClient } from '../core/BrowserClient';

export async function hover(client: BrowserClient, selector: string) {
  try {
    await client.waitForSelector(selector);
    await client.page!.hover(selector);
    console.log(`Hovered over element: ${selector}`);
  } catch (error) {
    console.error(`Failed to hover over element: ${selector}`, error);
    throw error;
  }
}