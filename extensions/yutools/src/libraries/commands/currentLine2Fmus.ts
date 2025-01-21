import * as vscode from 'vscode';
import { createAndInsertTextIntoUntitledEditor, getActiveEditor, getCurrentLine, getEditorDirectoryOrCwd } from '../client/editors';
import { runFmus2 } from '../client/network/fmusUtils';

/**
 * A parameterized function to process the current line, send it to FMUS,
 * and handle the response based on the provided response handler.
 *
 * @param responseHandler - A custom response handler function.
 */
export const currentLine2FmusInternal = (
    responseHandler: (response: Response) => Promise<void>
) => {
    return async () => {
        try {
            const currentLine = getCurrentLine();
            if (!currentLine || currentLine.trim() === '') {
                vscode.window.showErrorMessage('Current line is empty. Please write some text on the line and try again.');
                return;
            }
            await runFmus2(currentLine, getEditorDirectoryOrCwd(), responseHandler);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    };
};

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

export const currentLine2Fmus = vscode.commands.registerCommand('yutools.currentLine2Fmus',
    currentLine2FmusInternal(defaultResponseHandler)
);

// export function register_libraries_commands(context: vscode.ExtensionContext) {
//     context.subscriptions.push(currentLine2Fmus);
// }
