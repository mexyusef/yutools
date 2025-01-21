import * as vscode from 'vscode';
import { createAndInsertTextIntoUntitledEditor, getActiveEditor, getEditorContent, getEditorDirectoryOrCwd } from '../client/editors';
import { queryLocalLLM } from '../client/network/localLLMUtils';
import { runFmus2 } from '../client/network/fmusUtils';

/**
 * A parameterized function to process the entire editor content, send it to a backend,
 * and handle the response based on the provided response handler.
 */
export const editorContent2LocalLLMInternal = () => {
    return async () => {
        try {
            const editorContent = getEditorContent();
            if (!editorContent || editorContent.trim() === '') {
                vscode.window.showErrorMessage('Editor content is empty. Please write some text and try again.');
                return;
            }
            await queryLocalLLM(editorContent);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
    };
};

/**
 * A parameterized function to process the entire editor content, send it to FMUS,
 * and handle the response based on the provided response handler.
 */
export const editorContent2FmusInternal = (
    responseHandler: (response: Response) => Promise<void>
) => {
    return async () => {
        try {
            const editorContent = getEditorContent();
            if (!editorContent || editorContent.trim() === '') {
                vscode.window.showErrorMessage('Editor content is empty. Please write some text and try again.');
                return;
            }
            await runFmus2(editorContent, getEditorDirectoryOrCwd(), responseHandler);
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

export const editorContent2Fmus = vscode.commands.registerCommand(
    'yutools.editorContent2Fmus',
    editorContent2FmusInternal(defaultResponseHandler)
);

export const editorContent2LocalLLM = vscode.commands.registerCommand(
    'yutools.editorContent2LocalLLM',
    editorContent2LocalLLMInternal()
);

// export function register_libraries_commands(context: vscode.ExtensionContext) {
//     context.subscriptions.push(editorContent2LocalLLM);
//     context.subscriptions.push(editorContent2Fmus);
// }
