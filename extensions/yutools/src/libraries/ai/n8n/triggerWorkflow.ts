import * as vscode from 'vscode';
import { N8nClient } from './N8nClient';

export function registerTriggerWorkflowCommand(context: vscode.ExtensionContext) {
  const triggerWorkflowCommand = vscode.commands.registerCommand('extension.triggerWorkflow', async () => {
    const n8nClient = new N8nClient();

    // Get the active text editor
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }

    // Get the selected code
    const selectedCode = editor.document.getText(editor.selection);

    try {
      // Trigger a n8n workflow with the selected code
      const response = await n8nClient.triggerWorkflow('your-workflow-id', {
        code: selectedCode,
      });

      // Show the result to the user
      vscode.window.showInformationMessage(`Workflow triggered successfully: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to trigger workflow: ${error.message}`);
    }
  });

  context.subscriptions.push(triggerWorkflowCommand);
}