import * as vscode from 'vscode';
import { selectedContent2FmusInternal } from './selectedContent2Fmus';

// // Custom backend URL
// const customBackendUrl = 'https://my-custom-backend.com';

// Custom response handler
const myCustomResponseHandler = async (response: Response) => {
    const responseData = await response.json();
    if (responseData && responseData.result) {
        vscode.window.showInformationMessage('Custom handler: ' + responseData.result);
    } else {
        vscode.window.showErrorMessage('Custom handler: Invalid response format.');
    }
};

// Register the command with custom parameters
vscode.commands.registerCommand(
    'myExtension.customProcessCommand',
    selectedContent2FmusInternal(
        // customBackendUrl,
        myCustomResponseHandler
    )
);
