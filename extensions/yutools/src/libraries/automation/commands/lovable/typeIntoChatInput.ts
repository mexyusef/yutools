import { BrowserClient, type } from "../..";

export async function typeIntoChatInput(client: BrowserClient, text: string) {
  try {
    // Wait for the textarea to be visible
    await client.waitForSelector('#chatinput', 10_000);

    // Type the text into the textarea
    await type(client, '#chatinput', text);
    console.log(`Typed into chat input: ${text}`);
  } catch (error) {
    console.error(`Failed to type into chat input: ${error}`);
    throw error;
  }
}