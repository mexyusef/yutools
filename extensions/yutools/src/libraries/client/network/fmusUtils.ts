import { API_BASE_URL } from '@/constants';
import * as vscode from 'vscode';
import { sendFetchRequest } from './fetchHelper';
import { getCurrentWorkingDirectory } from '../settings/configUtils';
import { createAndInsertTextIntoUntitledEditor } from '../editors';

const API_URL = `${API_BASE_URL}/run_fmus`;

/**
 * Creates the payload for the FMUS API request.
 *
 * @param text - The input text to process.
 * @param dir - The directory to be included in the payload.
 * @returns The payload object.
 */
function createFmusPayload(text: string, dir: string): any {
    return {
        content: `fmuslang:${text}`,
        meta: {
            metaWorkspacesFspath: [dir],
            metaWorkspacesPath: [dir],
            currentProjectFolder: dir,
            metaDocument: {
                fsPath: dir,
                filename: dir,
                path: dir,
                language: 'javascript',
            },
        },
    };
}

/**
 * Runs FMUS at a specific directory.
 *
 * @param text - The content to process.
 * @param dir - The directory to execute FMUS (default from config).
 */
export async function runFmus(text: string, dir?: string): Promise<void> {
    // Default directory from config if not provided
    const targetDir = dir || getCurrentWorkingDirectory();

    const payload = createFmusPayload(text, targetDir);

    await sendFetchRequest({
        url: API_URL,
        method: 'POST',
        payload,
        responseHandler: async (response) => {
            const data = await response.json();
            vscode.window.showInformationMessage(JSON.stringify(data, null, 2));
        },
        errorHandler: (error) => {
            vscode.window.showErrorMessage(`Error running FMUS: ${error.message}`);
        },
    });
}


/**
 * Runs FMUS at a specific directory with customizable response and error handlers.
 *
 * @param text - The content to process.
 * @param dir - The directory to execute FMUS (default from config).
 * @param responseHandler - Optional custom response handler.
 * @param errorHandler - Optional custom error handler.
 */
export async function runFmus2(
    text: string,
    dir?: string,
    responseHandler?: (response: Response) => Promise<void>,
    errorHandler?: (error: any) => void
): Promise<void> {
    const targetDir = dir || getCurrentWorkingDirectory();

    const payload = createFmusPayload(text, targetDir);

    // Default response handler
    const defaultResponseHandler = async (response: Response) => {
        const responseData = await response.json();
        const stringifiedResponse = JSON.stringify(responseData, null, 2);
        await createAndInsertTextIntoUntitledEditor(stringifiedResponse);
        // vscode.window.showInformationMessage(stringifiedResponse);
    };

    // Default error handler
    const defaultErrorHandler = (error: any) => {
        vscode.window.showErrorMessage(`Error running FMUS: ${error.message}`);
    };

    await sendFetchRequest({
        url: API_URL,
        method: 'POST',
        payload,
        responseHandler: responseHandler || defaultResponseHandler,
        errorHandler: errorHandler || defaultErrorHandler,
    });
}
