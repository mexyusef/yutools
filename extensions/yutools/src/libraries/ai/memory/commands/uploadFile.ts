import * as vscode from 'vscode';
import { PersistentMemoryWithFiles } from '../PersistentMemoryWithFiles';

export const uploadFile = (memory: PersistentMemoryWithFiles) => vscode.commands.registerCommand('yutools.llm.memory.uploadFile', async () => {
  // Prompt the user to select a file
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    filters: {
      'Text Files': ['txt'],
      'PDF Files': ['pdf'],
      'Image Files': ['png', 'jpg', 'jpeg'],
    },
  });

  if (fileUri && fileUri[0]) {
    const filePath = fileUri[0].fsPath;
    const fileName = filePath.split('/').pop() || 'file';

    // Determine the file type based on the extension
    const fileType = fileName.endsWith('.txt')
      ? 'text'
      : fileName.endsWith('.pdf')
      ? 'pdf'
      : 'image';

    // Upload the file to the conversation
    try {
      await memory.uploadFile(filePath, fileName, fileType);
      vscode.window.showInformationMessage(`File "${fileName}" uploaded successfully!`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to upload file: ${error}`);
    }
  }
});