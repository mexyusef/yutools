import * as vscode from 'vscode';
import { createAndInsertTextIntoUntitledEditor, getSelectedText } from '../client/editors';
import { sendFetchRequest } from '../client/network/fetchHelper';
import { API_BASE_URL } from '@/constants';
import internal from 'stream';

/**
 * TODO
 * 
 * parameterized backendUrl dan response handler
 * 
 * selection to fmus
 * selection to llm
 * selection to groq
 * selection to openai
 * selection to gemini
 * selection to together
 * 
 * content to fmus
 * content to llm
 */

/**
 * Registers a command to process selected text in the active editor, send it to a backend,
 * and insert the server's response into a new untitled editor on the right.
 */
const internal_function = async () => {
  try {
    const selectedText = getSelectedText();

    // Validate that selection exists
    if (!selectedText) {
      vscode.window.showErrorMessage('Please select some text to process.');
      return;
    }

    // Define server URL
    const backendUrl = API_BASE_URL;

    // Send selected text to the backend and process response
    await sendFetchRequest({
      url: backendUrl,
      method: 'POST',
      payload: { content: selectedText },
      responseHandler: async (response: Response) => {
        const responseData = await response.json();

        // Validate the response content
        if (responseData && responseData.message) {
          // Insert server response into a new untitled editor
          await createAndInsertTextIntoUntitledEditor(responseData.message);
          vscode.window.showInformationMessage('Processed response inserted on the right side.');
        } else {
          vscode.window.showErrorMessage('Unexpected response format from the server.');
        }
      },
      errorHandler: (error: any) => {
        vscode.window.showErrorMessage(`Failed to process text: ${error.message}`);
      },
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
};

export const processSelectionAndSend = vscode.commands.registerCommand(
  'yutools.processSelectionAndSend',
  internal_function
);

