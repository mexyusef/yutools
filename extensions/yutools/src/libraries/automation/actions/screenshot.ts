import { BrowserClient } from '../core/BrowserClient';

export async function screenshot(client: BrowserClient, path: string, selector?: string) {
  try {
    if (selector) {
      // await client.waitForSelector(selector);
      await client.waitForSelector(selector, 60_000); // default 30s

      // Get the bounding box of the element
      const elementHandle = await client.page!.$(selector);
      if (!elementHandle) {
        throw new Error(`Element not found: ${selector}`);
      }

      const boundingBox = await elementHandle.boundingBox();
      if (!boundingBox) {
        throw new Error(`Element is not visible: ${selector}`);
      }

      // Take a screenshot of the element using the bounding box
      await client.page!.screenshot({
        path,
        clip: {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      });

      await elementHandle.dispose(); // Clean up the element handle
    } else {
      // Take a full-page screenshot
      await client.page!.screenshot({ path });
    }

    console.log(`Screenshot saved to: ${path}`);
  } catch (error) {
    console.error('Failed to take screenshot', error);
    throw error;
  }
}