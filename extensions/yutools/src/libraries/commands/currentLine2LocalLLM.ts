import * as vscode from 'vscode';
import { getActiveEditor, getCurrentLine } from '../client/editors';
import { queryLocalLLM } from '../client/network/localLLMUtils';

/**
 * A parameterized function to process the current line, send it to a backend,
 * and handle the response based on the provided response handler.
 *
 * @param backendUrl - The backend URL to send the request to.
 * @param responseHandler - A custom response handler function.
 */
export const currentLine2LocalLLMInternal = (
) => {
    return async () => {
        try {
            const currentLine = getCurrentLine();
            if (!currentLine || currentLine.trim() === '') {
                vscode.window.showErrorMessage('Current line is empty. Please write some text on the line and try again.');
                return;
            }
            await queryLocalLLM(currentLine);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    };
};

export const currentLine2LocalLLM = vscode.commands.registerCommand(
    'yutools.currentLine2LocalLLM',
    currentLine2LocalLLMInternal()
);

// export function register_libraries_commands(context: vscode.ExtensionContext) {
//     context.subscriptions.push(currentLine2LocalLLM);
// }
