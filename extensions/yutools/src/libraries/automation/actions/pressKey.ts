import { BrowserClient } from '../core/BrowserClient';

export async function pressKey(client: BrowserClient, selector: string, key: string) {
  if (!client.page) throw new Error('Page not initialized. Call launch() first.');
  await client.page.focus(selector);
  await client.page.keyboard.press(key);
}