import { WAIT_FOR_ELEMENT_TIMEOUT } from '../constants';
import { BrowserClient } from '../core/BrowserClient';

export async function waitForElement(client: BrowserClient, selector: string, timeout: number = WAIT_FOR_ELEMENT_TIMEOUT) {
  try {
    await client.waitForSelector(selector, timeout);
    console.log(`Element found: ${selector}`);
  } catch (error) {
    console.error(`Element not found: ${selector}`, error);
    throw error;
  }
}