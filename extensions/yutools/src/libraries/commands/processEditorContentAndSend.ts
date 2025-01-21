import * as vscode from 'vscode';
import { createAndInsertTextIntoUntitledEditor, getEditorContent, getSelectedText } from '../client/editors';
import { sendFetchRequest } from '../client/network/fetchHelper';
import { API_BASE_URL } from '@/constants';

const internal_function = async () => {
  try {
    // Retrieve the full content of the active editor
    const editorContent = getEditorContent();

    // Validate that content exists
    if (!editorContent || editorContent.trim() === '') {
      vscode.window.showErrorMessage('Editor content is empty. Nothing to process.');
      return;
    }

    // Define server URL
    const backendUrl = API_BASE_URL;

    // Send editor content to the backend and process response
    await sendFetchRequest({
      url: backendUrl,
      method: 'POST',
      payload: { content: editorContent },
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
        vscode.window.showErrorMessage(`Failed to process editor content: ${error.message}`);
      },
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
};

export const processEditorContentAndSend = vscode.commands.registerCommand(
  'yutools.processEditorContentAndSend',
  internal_function
);
