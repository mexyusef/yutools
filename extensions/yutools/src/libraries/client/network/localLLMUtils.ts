import * as vscode from 'vscode';
import { sendFetchRequest } from './fetchHelper';
import { API_BASE_URL } from '@/constants';
import { createUntitledTextEditorOnSide } from '../editors';


const DEFAULT_API_ENDPOINT = '/quickQuery';

interface ApiResponse {
    response: string;
}

/**
 * Sends a prompt to the specified API endpoint and retrieves the response.
 *
 * @param prompt - The input text or query.
 * @param endpoint - The API endpoint (default: '/quickQuery').
 * @returns A promise that resolves to the API response as a string.
 */
async function fetchApiResponse(prompt: string, endpoint: string = DEFAULT_API_ENDPOINT): Promise<string> {
    const payload = { prompt };

    return new Promise((resolve, reject) => {
        sendFetchRequest({
            url: `${API_BASE_URL}${endpoint}`,
            method: 'POST',
            payload,
            responseHandler: async (response: Response) => {
                const data: ApiResponse = await response.json();
                resolve(data.response);
            },
            errorHandler: (error: any) => {
                reject(new Error(`API request failed: ${error.message}`));
            },
        });
    });
}

/**
 * Queries the language model (LLM) with a given prompt and inserts the result into the active editor.
 *
 * @param prompt - The input prompt/query for the LLM.
 */
export async function queryLocalLLM(prompt: string): Promise<void> {
    // let editor = vscode.window.activeTextEditor;
    // // Ensure there's an active editor, otherwise create a new untitled file
    // if (!editor) {
    //     editor = await createUntitledTextEditorOnSide();
    //     // eslint-disable-next-line curly
    //     if (!editor) return;
    // }
    const editor = await createUntitledTextEditorOnSide();
    const selection = editor.selection;
    const insertionPosition = selection.active;

    return vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: 'Processing your request...',
            cancellable: false,
        },
        async (progress) => {
            progress.report({ increment: 0, message: 'Sending query to the server...' });

            try {
                const result = await fetchApiResponse(prompt);

                // Insert the result into the editor at the current position
                await editor.edit((editBuilder) => {
                    editBuilder.insert(insertionPosition, `\n${result}`);
                });

                vscode.window.showInformationMessage('Query processed successfully!');
            } catch (error: any) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
            }

            progress.report({ increment: 100, message: 'Done!' });
        }
    );
}
