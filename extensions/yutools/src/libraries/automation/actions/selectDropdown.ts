import { BrowserClient } from '../core/BrowserClient';

export async function selectDropdown(client: BrowserClient, selector: string, value: string) {
  try {
    await client.waitForSelector(selector);
    await client.page!.selectOption(selector, value);
    console.log(`Selected option "${value}" from dropdown: ${selector}`);
  } catch (error) {
    console.error(`Failed to select option from dropdown: ${selector}`, error);
    throw error;
  }
}