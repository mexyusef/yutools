import * as vscode from 'vscode';
import { createAndInsertTextIntoUntitledEditor, getEditorDirectoryOrCwd, getSelectedText } from '../client/editors';
// import { sendFetchRequest } from '../client/network/fetchHelper';
// import { runFmus2 } from '../client/network/fmusUtils';
import { queryLocalLLM } from '../client/network/localLLMUtils';

/**
 * A parameterized function to process selected text, send it to a backend,
 * and handle the response based on the provided response handler.
 *
 * @param backendUrl - The backend URL to send the request to.
 * @param responseHandler - A custom response handler function.
 */
export const selectedContent2LocalLLMInternal = (
    // backendUrl: string,
    // responseHandler: (response: Response) => Promise<void>
) => {
    return async () => {
        try {
            const selectedText = getSelectedText();
            // Validate that selection exists
            if (!selectedText) {
                vscode.window.showErrorMessage('Please select some text to process.');
                return;
            }
            // // Send selected text to the backend and process response
            // await sendFetchRequest({
            //     url: backendUrl,
            //     method: 'POST',
            //     payload: { content: selectedText },
            //     responseHandler,
            //     errorHandler: (error: any) => {
            //         vscode.window.showErrorMessage(`Failed to process text: ${error.message}`);
            //     },
            // });
            await queryLocalLLM(selectedText);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    };
};

/**
 * Example of a default response handler.
 */
const defaultResponseHandler = async (response: Response) => {
    const responseData = await response.json();

    if (responseData) {
        const formattedResponse = JSON.stringify(responseData, null, 2);
        await createAndInsertTextIntoUntitledEditor(formattedResponse);
        vscode.window.showInformationMessage('Processed response inserted on the right side.');
    } else {
        vscode.window.showErrorMessage('Unexpected response format from the server.');
    }
};

/**
 * Default exported command for backward compatibility.
 */
export const selectedContent2LocalLLM = vscode.commands.registerCommand(
    'yutools.selectedContent2LocalLLM',
    selectedContent2LocalLLMInternal(
        // 'https://default-backend-url.com',
        // defaultResponseHandler
    )
);
