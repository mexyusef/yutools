import * as vscode from 'vscode';
import { createAndInsertTextIntoUntitledEditor, getActiveEditor } from '.';
import { sendFetchRequest } from '../network/fetchHelper';
/**
 * Gets the current selection in the active editor and processes it with a provided handler.
 *
 * @param {Function} handler - The callback function to process the selection.
 * @param {boolean} [showError=true] - Whether to show an error if no active editor or selection exists.
 * @returns {void}
 */
export const processSelection = (handler: (selection: string) => void, showError: boolean = true): void => {
    const editor = getActiveEditor(showError);
    // eslint-disable-next-line curly
    if (!editor) return;

    const selection = editor.document.getText(editor.selection);
    if (selection.trim() === "") {
        if (showError) {
            vscode.window.showErrorMessage("No text selected in the editor.");
        }
        return;
    }

    try {
        handler(selection);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Error processing selection: ${error.message}`);
    }
};

// const processSelectedTextCommand = vscode.commands.registerCommand('myExtension.processSelectedText', () => {
//   processSelection((selection) => {
//       console.log("Processed selection:", selection);
//       vscode.window.showInformationMessage(`You selected: ${selection}`);
//   });
// });

export interface EditorProcessingOptions {
    processor: (input: string | undefined, context: EditorContext) => void; // Function to process the input
    includeSelection?: boolean; // Include the current selection
    includeContent?: boolean; // Include the entire editor content
    includeCurrentLine?: boolean; // Include the current line's text
    fallback?: string; // Fallback if no content is selected or available
}

export interface EditorContext {
    document: vscode.TextDocument; // Current document reference
    editor: vscode.TextEditor; // Current editor reference
    selection: string | undefined; // Selected text
    content: string; // Entire editor content
    currentLine: string | undefined; // Current line's content
}

/**
 * Processes editor content based on specified options.
 */
export async function processEditorContent(options: EditorProcessingOptions): Promise<void> {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    const content = document.getText();
    const currentLine = document.lineAt(selection.start.line).text;

    // Build context
    const context: EditorContext = {
        document,
        editor,
        selection: options.includeSelection ? selectedText || options.fallback : undefined,
        content: options.includeContent ? content : '',
        currentLine: options.includeCurrentLine ? currentLine : undefined,
    };

    // Determine input for processing
    const input = [
        context.selection,
        options.includeContent ? context.content : '',
        options.includeCurrentLine ? context.currentLine : '',
    ]
        .filter(Boolean)
        .join('\n'); // Combine selected inputs with newlines

    // Pass input and context to the processor
    options.processor(input, context);
}

/**
 * Use case: Process the selected text in the active editor, send it to a server,
 * and insert the server's response content into a new untitled text editor.
 * @param serverUrl The URL of the backend server.
 */
export const processAndInsertServerResponse = (serverUrl: string): void => {
    processSelection(async (selectedText: string) => {
        await sendFetchRequest({
            url: serverUrl,
            method: 'POST',
            payload: { content: selectedText },
            responseHandler: async (response: Response) => {
                const responseData = await response.json();
                if (responseData && responseData.message) {
                    await createAndInsertTextIntoUntitledEditor(responseData.message);
                } else {
                    vscode.window.showErrorMessage('Unexpected response from server.');
                }
            },
            errorHandler: (error: any) => {
                vscode.window.showErrorMessage(`Error fetching data from server: ${error.message}`);
            },
        });
    });
};
