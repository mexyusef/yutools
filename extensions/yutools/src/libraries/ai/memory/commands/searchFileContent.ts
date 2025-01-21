import * as vscode from 'vscode';
import { PersistentMemoryWithFiles } from '../PersistentMemoryWithFiles';

export const searchFileContent = (memory: PersistentMemoryWithFiles) => vscode.commands.registerCommand('yutools.llm.memory.searchFileContent',
  async () => {
    const files = memory.getFiles();

    if (files.length === 0) {
      vscode.window.showInformationMessage('No files uploaded to the conversation.');
      return;
    }

    // Prompt the user to select a file
    const fileNames = files.map((file) => file.name);
    const selectedFileName = await vscode.window.showQuickPick(fileNames, {
      placeHolder: 'Select a file to search',
    });

    if (selectedFileName) {
      const selectedFile = files.find((file) => file.name === selectedFileName);

      if (selectedFile) {
        // Display the file content in a new text document
        const content = selectedFile.chunks.join('\n');
        const document = await vscode.workspace.openTextDocument({
          content,
          language: 'plaintext',
        });

        await vscode.window.showTextDocument(document);
      }
    }
  });