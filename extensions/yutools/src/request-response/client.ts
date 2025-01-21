import { RequestResponseHandler } from './requestResponseProtocol';

declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

const requestResponseHandler = new RequestResponseHandler(
    (message) => vscode.postMessage(message), // Send message to VS Code
    (listener) => window.addEventListener('message', (event) => listener(event as MessageEvent)) // Listen for messages
);

async function fetchConfigValue() {
    try {
        const configValue = await requestResponseHandler.sendRequest<{ key: string }, string>(
            'getConfig',
            { key: 'workingDirectory' }
        );
        console.log('Received config value:', configValue);
        // Use the config value as needed
    } catch (error) {
        console.error('Error fetching config value:', error);
    }
}
