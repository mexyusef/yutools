import { BrowserClient } from '../core/BrowserClient';

let client: BrowserClient | null = null;

export function setClient(browserClient: BrowserClient) {
  client = browserClient;
}

export function getClient(): BrowserClient {
  if (!client) {
    throw new Error('Browser client not initialized. Call setClient() first.');
  }
  return client;
}

export async function getClientOrInit(): Promise<BrowserClient> {
  if (!client) {
    // throw new Error('Browser client not initialized. Call setClient() first.');
    const clientNew = new BrowserClient('chromium');
    await clientNew.launch({
      executablePath: 'C:\\Users\\usef\\AppData\\Local\\ms-playwright\\chromium-1148\\chrome-win\\chrome.exe',
      headless: false,
    });
    setClient(clientNew);
    return clientNew;
  }
  return client as BrowserClient;
}

export async function closeClient() {
  if (client) {
    await client.close();
    client = null;
  }
}