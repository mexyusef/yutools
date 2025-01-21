import { RELAXED_GOTO_TIMEOUT } from '../constants';
import { BrowserClient } from '../core/BrowserClient';

export async function navigate(client: BrowserClient, url: string, timeout: number = RELAXED_GOTO_TIMEOUT) {
  try {
    await client.goto(url, timeout);
    console.log(`Navigated to: ${url}`);
  } catch (error) {
    // Failed to navigate to: https://www.nytimes.com color: blue color:  nYTimes: Timeout 30000ms exceeded.
    console.error(`Failed to navigate to: ${url}`, error);
    throw error;
  }
}