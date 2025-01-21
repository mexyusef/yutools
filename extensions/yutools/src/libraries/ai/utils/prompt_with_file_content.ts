import * as vscode from 'vscode';
import * as fs from 'fs';
// import * as path from 'path';

export const prompt_with_file_content = vscode.commands.registerCommand('yutools.ai.utils.prompt_with_file_content', async () => {
  // Step 1: Ask for user prompt (A)
  const userPrompt = await vscode.window.showInputBox({
    placeHolder: 'Enter your prompt',
    prompt: 'This will be used as the user prompt (A)'
  });

  if (!userPrompt) {
    vscode.window.showErrorMessage('No user prompt provided.');
    return;
  }

  // Step 2: Check if there's an active editor with content
  let fileContent = '';
  const activeEditor = vscode.window.activeTextEditor;

  if (activeEditor && activeEditor.document.getText()) {
    fileContent = activeEditor.document.getText();
  } else {
    // Step 3: If no active editor or no content, open file dialog
    const fileUri = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: 'Select a file'
    });

    if (fileUri && fileUri[0]) {
      try {
        fileContent = fs.readFileSync(fileUri[0].fsPath, 'utf8');
      } catch (error) {
        vscode.window.showErrorMessage('Failed to read the selected file.');
        return;
      }
    } else {
      vscode.window.showErrorMessage('No file selected.');
      return;
    }
  }

  // Step 4: Define the delimiter (B)
  const delimiter = '---FILE CONTENT---';

  // Step 5: Combine user prompt, delimiter, and file content
  const finalOutput = `${userPrompt}\n\n${delimiter}\n${fileContent}`;

  // Step 6: Display the result in a new document
  const newDocument = await vscode.workspace.openTextDocument({
    content: finalOutput,
    language: 'plaintext'
  });

  await vscode.window.showTextDocument(newDocument);
});

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(prompt_with_file_content);
}
