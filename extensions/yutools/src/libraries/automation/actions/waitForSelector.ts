import { WAIT_FOR_ELEMENT_TIMEOUT } from '../constants';
import { BrowserClient } from '../core/BrowserClient';

// @deprecated, use waitForElement
// async waitForSelector(selector: string, timeout: number = WAIT_FOR_SELECTOR_TIMEOUT) {
//   if (!this.page) throw new Error('Page not initialized. Call launch() first.');
//   await this.page.waitForSelector(selector, { timeout });
// }
export async function waitForSelector(client: BrowserClient, selector: string, timeout: number = WAIT_FOR_ELEMENT_TIMEOUT) {
  try {
    await client.waitForSelector(selector, timeout);
    console.log(`selector found: ${selector}`);
  } catch (error) {
    console.error(`selector not found: ${selector}`, error);
    throw error;
  }
}