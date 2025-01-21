// declare function acquireVsCodeApi(): any;
// const vscode = acquireVsCodeApi();
import { vscode } from "@/vscode";

export async function getChatCompletionWebview(
  provider: string,
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
) {

  return new Promise((resolve, reject) => {
    // Setup one-time message listener for the response
    const messageHandler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'chat-response') {
        window.removeEventListener('message', messageHandler);
        resolve(message.response);
      } else if (message.type === 'chat-error') {
        window.removeEventListener('message', messageHandler);
        reject(message.error);
      }
    };

    window.addEventListener('message', messageHandler);

    // Send message to extension host
    vscode.postMessage({
      type: 'chat-request',
      llmMessages: messages,
      provider,
    });
  });
}
