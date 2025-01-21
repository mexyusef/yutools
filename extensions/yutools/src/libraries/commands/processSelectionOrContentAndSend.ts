import * as vscode from 'vscode';
import { createAndInsertTextIntoUntitledEditor, getEditorContent, getSelectedText } from '../client/editors';
import { sendFetchRequest } from '../client/network/fetchHelper';
import { API_BASE_URL } from '@/constants';

const internal_function = async () => {
  try {
    // Try to get the selected text
    let contentToProcess = getSelectedText();

    // If no selection exists, fallback to the editor's full content
    if (!contentToProcess || contentToProcess.trim() === '') {
      contentToProcess = getEditorContent();

      if (!contentToProcess || contentToProcess.trim() === '') {
        vscode.window.showErrorMessage('Editor content is empty. Nothing to process.');
        return;
      }
    }

    // Define server URL
    const backendUrl = API_BASE_URL;

    // Send the content to the backend and process the response
    await sendFetchRequest({
      url: backendUrl,
      method: 'POST',
      payload: { content: contentToProcess },
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
        vscode.window.showErrorMessage(`Failed to process content: ${error.message}`);
      },
    });
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
};

export const processSelectionOrContentAndSend = vscode.commands.registerCommand(
  'yutools.processSelectionOrContentAndSend',
  internal_function,
);

